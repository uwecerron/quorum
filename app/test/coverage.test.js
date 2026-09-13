import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DAOS, LIVE_DAO_LIST } from '../src/data/daos.js'
import { scoreDao, fetchTreasuryTotal } from '../src/lib/gass.js'
import handler from '../api/gass.js'
const coverage = JSON.parse(readFileSync(new URL('../src/data/coverage.json', import.meta.url)))

test('all supplied protocols and FORTH have coverage with separate Aave accounts', () => {
  assert.equal(coverage.protocols.length, 19)
  assert.equal(new Set(coverage.protocols.map((d) => d.id)).size, 19)
  for (const dao of coverage.protocols) assert.ok(DAOS[dao.id])
  assert.equal(coverage.protocols.find((d) => d.id === 'aave').treasuries.length, 2)
  assert.equal(coverage.protocols.find((d) => d.id === 'forth').treasuries.length, 0)
  assert.equal(coverage.protocols.find((d) => d.id === 'uni').treasuries[0].liquidUSD, 0)
  assert.equal(LIVE_DAO_LIST.length, 3)
})

test('research coverage cannot produce a score or make network calls', async () => {
  for (const dao of Object.values(DAOS).filter((d) => d.status === 'research')) {
    await assert.rejects(scoreDao(dao.id, 'test'), /coverage pending/)
  }
})

test('API distinguishes pending coverage and unknown IDs before key lookup', async () => {
  for (const [id, status, error] of [['forth',422,'coverage_pending'], ['gitcoin',422,'coverage_pending'], ['missing',404,'unknown_dao'], ['constructor',404,'unknown_dao']]) {
    const res = { setHeader() {}, status(n) { this.code = n; return this }, json(body) { this.body = body; return this } }
    await handler({ method: 'GET', query: { dao: id } }, res)
    assert.equal(res.code, status)
    assert.equal(res.body.error, error)
  }
})

test('treasury total includes native assets without claiming reachable value', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ data: { items: [
    {contract_address: DAOS.uni.token, quote: 100, quote_rate: 5},
    {contract_address: 'other', quote: 40},
    {is_spam: true, quote: 500}, {type: 'nft', quote: 800},
  ] } }) }))
  const result = await fetchTreasuryTotal(DAOS.uni, 'test')
  assert.equal(result.treasuryTotalUSD, 140)
  assert.equal(result.govSpotUSD, 5)
  assert.equal(result.valueAtRiskUSD, undefined)
})
