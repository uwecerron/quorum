// Shared GASS scoring logic + GoldRush (Covalent) fetch helpers.
// Lives in src/lib (NOT in api/) so Vercel never mistakes it for an endpoint.
// Imported by api/gass.js (serverless function) and the scripts/ CLIs.
//
// GASS v0 computes three factors from live GoldRush data:
//   - affordability : capture-cost floor vs. treasury value at risk
//   - concentration : share of supply held by the top holders (+ HHI)
//   - easeOfQuorum  : how small the quorum threshold is vs. circulating supply
// Timelock depth, guardian coverage and turnout are v1 (governance-contract
// reads) and are intentionally NOT part of v0 — this is honest about scope.

import { DAOS } from '../data/daos.js'

const BASE = 'https://api.covalenthq.com/v1'

function authHeaders(apiKey) {
  // GoldRush accepts the key as a Bearer token. Key stays server-side.
  return { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
}

async function goldrush(path, apiKey) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(apiKey) })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GoldRush ${res.status} on ${path} :: ${body.slice(0, 160)}`)
  }
  const json = await res.json()
  if (json.error) throw new Error(`GoldRush error: ${json.error_message || 'unknown'}`)
  return json.data
}

function toUnits(raw, decimals) {
  // raw is a base-unit decimal string; return a float in whole tokens.
  return parseFloat(raw) / 10 ** decimals
}

// --- factor: holder concentration --------------------------------------
export async function fetchConcentration(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/tokens/${dao.token}/token_holders_v2/?page-size=1000&page-number=0`,
    apiKey,
  )
  const items = data.items || []
  if (!items.length) throw new Error('no token holders returned')

  const decimals = items[0].contract_decimals ?? 18
  const totalSupply = toUnits(items[0].total_supply, decimals)

  // Exclude the protocol's OWN contracts from "external" concentration — a DAO
  // holding its own tokens in the treasury/timelock/governor, or supply parked
  // in the token contract or a burn address, is not a hostile capture vector.
  const exclude = new Set(
    [
      dao.treasury,
      dao.governor,
      dao.token,
      '0x0000000000000000000000000000000000000000',
      '0x000000000000000000000000000000000000dead',
    ].map((a) => (a || '').toLowerCase()),
  )
  const external = items.filter((h) => !exclude.has((h.address || '').toLowerCase()))

  const balances = external
    .map((h) => toUnits(h.balance, decimals))
    .filter((b) => b > 0)
    .sort((a, b) => b - a)

  const top10 = balances.slice(0, 10).reduce((s, b) => s + b, 0)
  const top10Share = totalSupply > 0 ? top10 / totalSupply : 0

  // HHI over the fetched external holders, on share-of-total-supply.
  const hhi = balances.reduce((s, b) => {
    const share = totalSupply > 0 ? b / totalSupply : 0
    return s + share * share
  }, 0)

  return {
    totalSupply,
    holdersSampled: balances.length,
    top10Share,
    hhi,
    topHolder: external[0] ? external[0].address : items[0].address,
  }
}

// --- factor: treasury value at risk ------------------------------------
export async function fetchValueAtRisk(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/address/${dao.treasury}/balances_v2/?quote-currency=USD`,
    apiKey,
  )
  const items = data.items || []
  const valueAtRiskUSD = items.reduce((s, it) => s + (it.quote || 0), 0)

  // Grab the governance token's spot price if the treasury holds it.
  const gov = items.find(
    (it) => (it.contract_address || '').toLowerCase() === dao.token.toLowerCase(),
  )
  const govSpotUSD = gov && gov.quote_rate ? gov.quote_rate : null

  return { valueAtRiskUSD, govSpotUSD }
}

// If the treasury doesn't hold its own token, fetch spot via pricing endpoint.
export async function fetchSpotPrice(dao, apiKey) {
  try {
    const data = await goldrush(
      `/pricing/historical_by_addresses_v2/${dao.chain}/USD/${dao.token}/?from=&to=`,
      apiKey,
    )
    const first = Array.isArray(data) ? data[0] : data.items && data.items[0]
    const price = first && first.prices && first.prices[0] && first.prices[0].price
    return price || null
  } catch {
    return null
  }
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

// --- combine into GASS v0 ----------------------------------------------
export function combineGass({ conc, var: varr, spotUSD, quorumTokens }) {
  const captureCostFloorUSD = spotUSD != null ? quorumTokens * spotUSD : null

  // affordability: how cheap, in ABSOLUTE dollars, to buy quorum-passing power.
  // Log scale — ~$50K or less is maximally capturable (cf. the 2-ETH incident),
  // ~$500M or more is effectively out of reach. This is what makes deep, liquid
  // blue chips score low and thin micro-cap DAOs score high. Treasury value is
  // reported separately as the stakes, not folded into capturability.
  let affordability = 0
  if (captureCostFloorUSD != null && captureCostFloorUSD > 0) {
    const lo = Math.log10(50_000)
    const hi = Math.log10(500_000_000)
    affordability = clamp01((hi - Math.log10(captureCostFloorUSD)) / (hi - lo))
  }

  // concentration: top-10 EXTERNAL holders' share of supply, saturating at 60%.
  const concentration = clamp01(conc.top10Share / 0.6)

  // easeOfQuorum: small quorum vs. supply = easier = higher risk (saturate <10%).
  const quorumShare = conc.totalSupply > 0 ? quorumTokens / conc.totalSupply : 1
  const easeOfQuorum = 1 - clamp01(quorumShare / 0.1)

  const gass = Math.round(
    100 * (0.6 * affordability + 0.2 * concentration + 0.2 * easeOfQuorum),
  )

  return {
    gass,
    components: {
      affordability: +(affordability * 100).toFixed(0),
      concentration: +(concentration * 100).toFixed(0),
      easeOfQuorum: +(easeOfQuorum * 100).toFixed(0),
    },
    detail: {
      valueAtRiskUSD: Math.round(varr.valueAtRiskUSD),
      captureCostFloorUSD: captureCostFloorUSD != null ? Math.round(captureCostFloorUSD) : null,
      top10Share: +(conc.top10Share * 100).toFixed(1),
      hhi: +conc.hhi.toFixed(4),
      quorumShareOfSupply: +(quorumShare * 100).toFixed(2),
      totalSupply: Math.round(conc.totalSupply),
      holdersSampled: conc.holdersSampled,
      spotUSD,
    },
  }
}

// --- top-level: score one DAO ------------------------------------------
export async function scoreDao(daoId, apiKey) {
  const dao = DAOS[daoId]
  if (!dao) throw new Error(`unknown dao: ${daoId}`)
  if (!apiKey) throw new Error('missing GOLDRUSH_API_KEY')

  const [conc, varr] = await Promise.all([
    fetchConcentration(dao, apiKey),
    fetchValueAtRisk(dao, apiKey),
  ])

  let spotUSD = varr.govSpotUSD
  if (spotUSD == null) spotUSD = await fetchSpotPrice(dao, apiKey)

  const scored = combineGass({ conc, var: varr, spotUSD, quorumTokens: dao.quorumTokens })

  return {
    dao: { id: dao.id, name: dao.name, ticker: dao.ticker, chain: dao.chain },
    ...scored,
    source: 'Covalent GoldRush',
    version: 'GASS v0',
    computedNote:
      'v0 heuristic from live on-chain data: affordability + concentration + ease-of-quorum. ' +
      'Capture-cost is a spot-price floor (ignores DEX slippage). Timelock/guardian/turnout are v1.',
  }
}
