#!/usr/bin/env node
// Build the live leaderboard: score every DAO in the registry from GoldRush,
// sort by GASS (most exposed first), and write src/data/leaderboard.json.
//
//   GOLDRUSH_API_KEY=cqt_xxx node scripts/leaderboard.mjs
//
// That JSON is what a public "Governance Risk Radar" page renders.
// Re-run daily (for example on a cron) to refresh.

import { writeFile } from 'node:fs/promises'
import { scoreDao } from '../src/lib/gass.js'
import { DAOS } from '../src/data/daos.js'

const apiKey = process.env.GOLDRUSH_API_KEY
if (!apiKey) {
  console.error('✖ Set GOLDRUSH_API_KEY first.  GOLDRUSH_API_KEY=cqt_xxx node scripts/leaderboard.mjs')
  process.exit(1)
}

const rows = []
for (const id of Object.keys(DAOS)) {
  try {
    const r = await scoreDao(id, apiKey)
    rows.push({
      id: r.dao.id,
      name: r.dao.name,
      ticker: r.dao.ticker,
      gass: r.gass,
      valueAtRiskUSD: r.detail.valueAtRiskUSD,
      captureCostFloorUSD: r.detail.captureCostFloorUSD,
      top10Share: r.detail.top10Share,
    })
    console.log(`  ✓ ${r.dao.name.padEnd(12)} GASS ${r.gass}`)
  } catch (err) {
    console.error(`  ✖ ${id}: ${err.message}`)
  }
}

rows.sort((a, b) => b.gass - a.gass)
const out = { generatedNote: 'GASS v0 from Covalent GoldRush', rows }
await writeFile(new URL('../src/data/leaderboard.json', import.meta.url), JSON.stringify(out, null, 2))
console.log(`\nWrote src/data/leaderboard.json (${rows.length} protocols).`)
