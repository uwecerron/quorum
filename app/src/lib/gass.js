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
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(apiKey), signal: AbortSignal.timeout(8000), redirect: 'error' })
  if (!res.ok) {
    throw new Error(`GoldRush request failed (${res.status})`)
  }
  const json = await res.json()
  if (!json || json.error || !json.data) throw new Error('Invalid GoldRush response')
  return json.data
}

function toUnits(raw, decimals) {
  // raw is a base-unit decimal string; return a float in whole tokens.
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36 ||
      typeof raw !== 'string' || !/^\d+$/.test(raw)) throw new Error('Invalid token units')
  const value = Number(raw) / 10 ** decimals
  if (!Number.isFinite(value)) throw new Error('Invalid token units')
  return value
}

// Factor: holder concentration.
// token_holders_v2 returns holders sorted by balance descending, so page 0
// covers the largest holders. We also sort defensively before taking the top 10.
export async function fetchConcentration(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/tokens/${dao.token}/token_holders_v2/?page-size=1000&page-number=0`,
    apiKey,
  )
  const items = data?.items
  if (!Array.isArray(items)) throw new Error('Missing GoldRush items')
  if (!items.length) throw new Error('no token holders returned')

  const decimals = items[0].contract_decimals
  const totalSupply = toUnits(items[0].total_supply, decimals)
  if (!(totalSupply > 0)) throw new Error('Invalid total supply')

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
  const top10Share = top10 / totalSupply
  if (external.reduce((sum, holder) => sum + holder.bal, 0) > totalSupply * (1 + 1e-9)) throw new Error('Holder balances exceed supply')

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

// Treasury balance total; governance reachability is not established.
// Fungible, non-spam holdings only, so scam airdrops and NFTs do not inflate
// the treasury figure and legitimate priced tokens are the only ones counted.
export async function fetchTreasuryTotal(dao, apiKey) {
  const data = await goldrush(
    `/${dao.chain}/address/${dao.treasury}/balances_v2/?quote-currency=USD&nft=false&no-nft-fetch=true`,
    apiKey,
  )
  const items = data?.items
  if (!Array.isArray(items)) throw new Error('Missing GoldRush items')
  if (items.some((it) => !it || (it.quote != null && (typeof it.quote !== 'number' || !Number.isFinite(it.quote) || it.quote < 0)))) throw new Error('Invalid treasury quote')
  const fungible = items.filter((it) => !it.is_spam && it.type !== 'nft' && (it.quote || 0) > 0)
  const treasuryTotalUSD = fungible.reduce((s, it) => s + (it.quote || 0), 0)

  // Take the governance token's spot price if the treasury holds it.
  const gov = items.find(
    (it) => (it.contract_address || '').toLowerCase() === dao.token.toLowerCase(),
  )
  const govSpotUSD = gov && gov.quote_rate ? gov.quote_rate : null

  return { treasuryTotalUSD, govSpotUSD }
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
  const positive = [conc.totalSupply, spotUSD, quorumTokens]
  const nonnegative = [conc.top10Share, conc.hhiSample, varr.treasuryTotalUSD]
  if (positive.some((n) => !Number.isFinite(n) || n <= 0) ||
      nonnegative.some((n) => !Number.isFinite(n) || n < 0) ||
      conc.top10Share > 1 + 1e-9 || quorumTokens > conc.totalSupply ||
      !Number.isInteger(conc.holdersSampled) || conc.holdersSampled < 0 ||
      !Number.isFinite(quorumTokens * spotUSD)) throw new Error('Invalid scoring inputs')
  const captureCostFloorUSD = quorumTokens * spotUSD

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
      treasuryTotalUSD: Math.round(varr.treasuryTotalUSD),
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
  if (!Object.hasOwn(DAOS, daoId)) throw new Error(`unknown dao: ${daoId}`)
  if (dao.status === 'research') throw new Error(`coverage pending for ${dao.name}: ${dao.missing.join('; ')}`)
  if (!apiKey) throw new Error('missing GOLDRUSH_API_KEY')

  const [conc, varr] = await Promise.all([
    fetchConcentration(dao, apiKey),
    fetchTreasuryTotal(dao, apiKey),
  ])

  let spotUSD = varr.govSpotUSD
  if (spotUSD == null) spotUSD = await fetchSpotPrice(dao, apiKey)
  if (!Number.isFinite(spotUSD) || !(spotUSD > 0)) {
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
    source: 'GoldRush by Covalent',
    version: 'GASS v0',
    computedNote:
      'GASS v0 from live on-chain data: affordability, concentration and ease of quorum. ' +
      'Quorum-cost estimate is spot price times configured quorum; it excludes slippage and does not establish control. ' +
      'Treasury total includes native tokens and is not verified reachable value. ' +
      'Quorum parameters are configured, not refreshed onchain. Timelock, guardian and turnout factors are not included.',
  }
}
