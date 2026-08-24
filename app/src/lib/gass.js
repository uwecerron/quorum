// Shared GASS scoring logic and GoldRush (Covalent) fetch helpers.
// Lives in src/lib (not in api/) so Vercel never treats it as an endpoint.
// Imported by api/gass.js (serverless function) and the scripts/ CLIs.
//
// GASS v0 computes three factors from live GoldRush data:
//   affordability : absolute dollars to buy quorum-passing voting power
//   concentration : share of supply held by the top external holders
//   easeOfQuorum  : how small the quorum threshold is vs. circulating supply
// Timelock depth, guardian coverage and turnout are v1 (they need
// governance-contract reads) and are deliberately out of v0 scope.

import { DAOS } from '../data/daos.js'

const BASE = 'https://api.covalenthq.com/v1'

function authHeaders(apiKey) {
  // GoldRush accepts the key as a Bearer token. The key stays server-side.
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

// Factor: holder concentration.
// token_holders_v2 returns holders sorted by balance descending, so page 0
// covers the largest holders. We also sort defensively before taking the top 10.
export async function fetchConcentration(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/tokens/${dao.token}/token_holders_v2/?page-size=1000&page-number=0`,
    apiKey,
  )
  const items = (data && data.items) || []
  if (!items.length) throw new Error('no token holders returned')

  const decimals = items[0].contract_decimals ?? 18
  const totalSupply = toUnits(items[0].total_supply, decimals)

  // Exclude the protocol's own contracts from external concentration. A DAO
  // holding its own tokens in the treasury, timelock or governor, or supply
  // parked in the token contract or a burn address, is not a capture vector.
  const exclude = new Set(
    [
      dao.treasury,
      dao.governor,
      dao.token,
      '0x0000000000000000000000000000000000000000',
      '0x000000000000000000000000000000000000dead',
    ].map((a) => (a || '').toLowerCase()),
  )
  const external = items
    .filter((h) => !exclude.has((h.address || '').toLowerCase()))
    .map((h) => ({ address: h.address, bal: toUnits(h.balance, decimals) }))
    .filter((h) => h.bal > 0)
    .sort((a, b) => b.bal - a.bal)

  const top10 = external.slice(0, 10).reduce((s, h) => s + h.bal, 0)
  const top10Share = totalSupply > 0 ? top10 / totalSupply : 0

  // HHI over the sampled external holders (top page), on share of total supply.
  const hhiSample = external.reduce((s, h) => {
    const share = totalSupply > 0 ? h.bal / totalSupply : 0
    return s + share * share
  }, 0)

  return {
    totalSupply,
    holdersSampled: external.length,
    top10Share,
    hhiSample,
    topHolder: external[0] ? external[0].address : items[0].address,
  }
}

// Factor: treasury value at risk.
// Fungible, non-spam holdings only, so scam airdrops and NFTs do not inflate
// the treasury figure and legitimate priced tokens are the only ones counted.
export async function fetchValueAtRisk(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/address/${dao.treasury}/balances_v2/?quote-currency=USD&nft=false&no-nft-fetch=true`,
    apiKey,
  )
  const items = (data && data.items) || []
  const fungible = items.filter((it) => !it.is_spam && it.type !== 'nft' && (it.quote || 0) > 0)
  const valueAtRiskUSD = fungible.reduce((s, it) => s + (it.quote || 0), 0)

  // Take the governance token's spot price if the treasury holds it.
  const gov = items.find(
    (it) => (it.contract_address || '').toLowerCase() === dao.token.toLowerCase(),
  )
  const govSpotUSD = gov && gov.quote_rate ? gov.quote_rate : null

  return { valueAtRiskUSD, govSpotUSD }
}

// If the treasury does not hold its own token, fetch spot via the pricing endpoint.
export async function fetchSpotPrice(dao, apiKey) {
  try {
    const data = await goldrush(
      `/pricing/historical_by_addresses_v2/${dao.chain}/USD/${dao.token}/`,
      apiKey,
    )
    const first = Array.isArray(data) ? data[0] : data && data.items && data.items[0]
    const price = first && first.prices && first.prices[0] && first.prices[0].price
    return price || null
  } catch {
    return null
  }
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

// Combine the three factors into a 0 to 100 GASS.
export function combineGass({ conc, var: varr, spotUSD, quorumTokens }) {
  const captureCostFloorUSD = spotUSD != null ? quorumTokens * spotUSD : null

  // affordability: how cheap, in absolute dollars, to buy quorum-passing power.
  // Log scale: about $50K or less is maximally capturable (see the 2 ETH
  // incident), about $500M or more is effectively out of reach. This is what
  // makes deep, liquid blue chips score low and thin micro-cap DAOs score high.
  // Treasury value is reported separately as the stakes, not folded into this.
  let affordability = 0
  if (captureCostFloorUSD != null && captureCostFloorUSD > 0) {
    const lo = Math.log10(50_000)
    const hi = Math.log10(500_000_000)
    affordability = clamp01((hi - Math.log10(captureCostFloorUSD)) / (hi - lo))
  }

  // concentration: top-10 external holders' share of supply, saturating at 60%.
  const concentration = clamp01(conc.top10Share / 0.6)

  // easeOfQuorum: a small quorum vs. supply is easier to reach (saturate under 10%).
  const quorumShare = conc.totalSupply > 0 ? quorumTokens / conc.totalSupply : 1
  const easeOfQuorum = 1 - clamp01(quorumShare / 0.1)

  const gass = Math.round(100 * (0.6 * affordability + 0.2 * concentration + 0.2 * easeOfQuorum))

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
      hhiSample: +conc.hhiSample.toFixed(4),
      quorumShareOfSupply: +(quorumShare * 100).toFixed(2),
      totalSupply: Math.round(conc.totalSupply),
      holdersSampled: conc.holdersSampled,
      spotUSD,
    },
  }
}

// Score one DAO.
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
  if (!(spotUSD > 0)) {
    // No usable price means we cannot compute an accurate capture cost.
    // Fail loudly rather than emit a misleadingly low (safe-looking) score.
    throw new Error(`no spot price available for ${dao.ticker}; score not computed`)
  }

  // Fraction-based governors (e.g. ENS) quote quorum as a share of supply, so
  // resolve the token count against live supply instead of a stale constant.
  const quorumTokens = dao.quorumFraction
    ? Math.round(dao.quorumFraction * conc.totalSupply)
    : dao.quorumTokens

  const scored = combineGass({ conc, var: varr, spotUSD, quorumTokens })

  return {
    dao: { id: dao.id, name: dao.name, ticker: dao.ticker, chain: dao.chain },
    ...scored,
    source: 'Covalent GoldRush',
    version: 'GASS v0',
    computedNote:
      'GASS v0 from live on-chain data: affordability, concentration and ease of quorum. ' +
      'Capture cost is a spot-price floor and ignores DEX slippage, so real acquisition ' +
      'cost is higher. Timelock, guardian and turnout factors are planned for v1.',
  }
}
