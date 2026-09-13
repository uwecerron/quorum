import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DAOS, LIVE_DAO_LIST } from '../src/data/daos.js'
import { scoreDao, fetchTreasuryTotal } from '../src/lib/gass.js'
import { createHandler } from '../api/gass.js'
const coverage = JSON.parse(readFileSync(new URL('../src/data/coverage.json', import.meta.url)))
const response = () => ({setHeader(){},status(n){this.code=n;return this},json(body){this.body=body;return this}})

test('all supplied protocols plus FORTH, Inverse and 0x are selectable live integrations', () => {
  for (const dao of coverage.protocols) assert.ok(DAOS[dao.id])
  assert.equal(LIVE_DAO_LIST.length,21)
  assert.equal(new Set(LIVE_DAO_LIST.map(d=>d.id)).size,21)
  for (const dao of LIVE_DAO_LIST) {
    assert.match(dao.token,/^0x[0-9a-f]{40}$/i)
    assert.ok(dao.treasuries.length,dao.id)
    assert.ok(dao.source)
  }
  assert.equal(DAOS.aave.treasuries.length,2)
})

test('every registered protocol reads GoldRush holders and configured accounts', async(t)=>{
  const urls=[]
  t.mock.method(globalThis,'fetch',async(url)=>{
    urls.push(url)
    const items=url.includes('token_holders') ? [{contract_decimals:18,total_supply:'1000000000000000000000000',balance:'100',address:'0x1111111111111111111111111111111111111111'}] : [{contract_address:'0x1111111111111111111111111111111111111111',quote:40}]
    return {ok:true,json:async()=>({data:{items}})}
  })
  for (const dao of LIVE_DAO_LIST) {
    urls.length=0
    const result=await scoreDao(dao.id,'fixture-key',{governance:async()=>({quorumTokens:100}),price:async()=>1})
    assert.ok(urls.some(u=>u.includes(dao.token)),dao.id)
    for(const w of dao.treasuries) assert.ok(urls.some(u=>u.includes(w.address)),dao.id)
    assert.equal(result.treasury.status,'live')
    assert.equal(result.detail.treasuryTotalUSD,dao.treasuries.length*40)
    if(['token-vote','aragon'].includes(dao.governanceModel)) assert.ok(Number.isFinite(result.gass),dao.id)
    else assert.equal(result.gass,null,dao.id)
  }
})

test('API accepts all registry IDs and rejects inherited object keys',async(t)=>{
  const previous=process.env.GOLDRUSH_API_KEY
  process.env.GOLDRUSH_API_KEY='fixture'
  t.after(()=>{if(previous===undefined) delete process.env.GOLDRUSH_API_KEY;else process.env.GOLDRUSH_API_KEY=previous})
  const handler=createHandler(async(id)=>({dao:{id}}))
  for(const dao of LIVE_DAO_LIST){const res=response();await handler({method:'GET',query:{dao:dao.id}},res);assert.equal(res.code,200)}
  for(const id of ['missing','constructor']){const res=response();await handler({method:'GET',query:{dao:id}},res);assert.equal(res.code,404)}
})

test('partial treasury refresh preserves accounts but never understates aggregate',async(t)=>{
  t.mock.method(globalThis,'fetch',async(url)=>{
    if(url.includes(DAOS.aave.treasuries[1].address)) throw Error('unavailable')
    return {ok:true,json:async()=>({data:{items:[{quote:140}]}})}
  })
  const result=await fetchTreasuryTotal(DAOS.aave,'test')
  assert.equal(result.status,'partial')
  assert.equal(result.treasuryTotalUSD,null)
  assert.equal(result.accounts[0].totalUSD,140)
  assert.equal(result.accounts[1].totalUSD,null)
})

test('governance failure retains live balances without inventing a score',async()=>{
  const result=await scoreDao('forth','test',{
    concentration:async()=>({totalSupply:1000000,top10Share:.2,holdersSampled:10}),
    treasury:async()=>({treasuryTotalUSD:50,accounts:[{status:'live'}]}),
    governance:async()=>{throw Error('RPC down')},price:async()=>1,
  })
  assert.equal(result.gass,null)
  assert.equal(result.detail.treasuryTotalUSD,50)
  assert.match(result.scoreUnavailableReason,/quorum/)
})
