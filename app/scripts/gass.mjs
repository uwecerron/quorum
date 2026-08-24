#!/usr/bin/env node
// Standalone CLI: compute a live GASS v0 score from GoldRush.
//
//   GOLDRUSH_API_KEY=cqt_xxx node scripts/gass.mjs comp
//   GOLDRUSH_API_KEY=cqt_xxx node scripts/gass.mjs uni ens
//
// Prints a human-readable breakdown. Same scoring as the /api/gass endpoint.

import { scoreDao } from '../src/lib/gass.js'
import { DAOS } from '../src/data/daos.js'

const apiKey = process.env.GOLDRUSH_API_KEY
if (!apiKey) {
  console.error('✖ Set GOLDRUSH_API_KEY in the environment first.')
  console.error('  e.g.  GOLDRUSH_API_KEY=cqt_xxx node scripts/gass.mjs comp')
  process.exit(1)
}

const ids = process.argv.slice(2)
const targets = ids.length ? ids : Object.keys(DAOS)

function usd(n) {
  if (n == null) return 'n/a'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n}`
}

for (const id of targets) {
  try {
    const r = await scoreDao(id, apiKey)
    const d = r.detail
    console.log('\n' + '─'.repeat(52))
    console.log(`  ${r.dao.name} (${r.dao.ticker})   GASS ${r.gass}/100`)
    console.log('─'.repeat(52))
    console.log(`  affordability   ${String(r.components.affordability).padStart(3)}   (cost to buy quorum, absolute $)`)
    console.log(`  concentration   ${String(r.components.concentration).padStart(3)}   (top-10 hold ${d.top10Share}% of supply)`)
    console.log(`  ease-of-quorum  ${String(r.components.easeOfQuorum).padStart(3)}   (quorum = ${d.quorumShareOfSupply}% of supply)`)
    console.log(`  ----`)
    console.log(`  treasury at risk        ${usd(d.valueAtRiskUSD)}`)
    console.log(`  capture-cost floor      ${usd(d.captureCostFloorUSD)}   (spot × quorum, no slippage)`)
    console.log(`  spot price              ${d.spotUSD != null ? '$' + d.spotUSD : 'n/a'}`)
    console.log(`  holders sampled         ${d.holdersSampled}`)
    console.log(`  source: ${r.source} · ${r.version}`)
  } catch (err) {
    console.error(`\n✖ ${id}: ${err.message}`)
  }
}
console.log('')
