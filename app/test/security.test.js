import test from 'node:test'
import assert from 'node:assert/strict'
import { createHandler } from '../api/gass.js'
import { combineGass, fetchConcentration, fetchTreasuryTotal } from '../src/lib/gass.js'
import { DAOS } from '../src/data/daos.js'
const response = () => ({ headers: {}, setHeader(k,v) { this.headers[k]=v }, status(n) { this.code=n; return this }, json(body) { this.body=body; return this } })
const valid = () => ({conc:{totalSupply:1000000,top10Share:.2,hhiSample:.01,holdersSampled:10},var:{treasuryTotalUSD:200},spotUSD:1,quorumTokens:20000})

test('invalid supply, price, quorum and treasury inputs fail closed', () => {
  for (const bad of [NaN, Infinity, 0, -1, '100']) {
    const input=valid(); input.conc.totalSupply=bad
    assert.throws(()=>combineGass(input), /Invalid scoring/)
  }
  for (const field of ['spotUSD','quorumTokens']) {
    const input=valid(); input[field]=Infinity
    assert.throws(()=>combineGass(input), /Invalid scoring/)
  }
  assert.ok(Number.isFinite(combineGass(valid()).gass))
})

test('unsupported methods and malformed query inputs never invoke scorer', async () => {
  const handler=createHandler(()=>assert.fail('unexpected scoring'))
  for (const [method,query,status] of [['POST',{dao:'comp'},405],['GET',{dao:['comp']},400],['GET',{dao:'comp',nonce:'1'},400],['GET',{dao:'../comp'},400]]) {
    const res=response(); await handler({method,query},res)
    assert.equal(res.code,status)
    assert.equal(res.headers['Cache-Control'],'no-store')
  }
})

test('concurrent requests share work; successful cache expires', async (t) => {
  const previous = process.env.GOLDRUSH_API_KEY
  process.env.GOLDRUSH_API_KEY = 'test-key'
  t.after(() => { if (previous === undefined) delete process.env.GOLDRUSH_API_KEY; else process.env.GOLDRUSH_API_KEY = previous })
  let calls=0, now=0
  const handler=createHandler(async()=>{calls++; return {gass:50}},()=>now)
  const req={method:'GET',query:{dao:'comp'}}
  await Promise.all(Array.from({length:20},()=>handler(req,response())))
  assert.equal(calls,1)
  await handler(req,response()); assert.equal(calls,1)
  now=300001
  await handler(req,response()); assert.equal(calls,2)
})

test('failed work is not cached and error detail is not returned', async (t) => {
  const previous = process.env.GOLDRUSH_API_KEY
  process.env.GOLDRUSH_API_KEY = 'test-key'
  t.after(() => { if (previous === undefined) delete process.env.GOLDRUSH_API_KEY; else process.env.GOLDRUSH_API_KEY = previous })
  t.mock.method(console,'error',()=>{})
  let calls=0
  const handler=createHandler(async()=>{calls++; throw Error('sensitive upstream payload')})
  for(let i=0;i<2;i++) {
    const res=response(); await handler({method:'GET',query:{dao:'comp'}},res)
    assert.equal(res.code,502)
    assert.ok(!JSON.stringify(res.body).includes('sensitive'))
  }
  assert.equal(calls,2)
})

test('GoldRush calls have a timeout, refuse redirects and reject missing balances', async (t) => {
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    assert.ok(options.signal instanceof AbortSignal)
    assert.equal(options.redirect,'error')
    return {ok:true,json:async()=>({data:{}})}
  })
  await assert.rejects(fetchTreasuryTotal(DAOS.comp,'test'),/Missing GoldRush items/)
})

test('malformed holder units are rejected before computing concentration', async(t)=>{
  t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>({data:{items:[{contract_decimals:18,total_supply:'bad',balance:'100',address:'0x123'}]}})}))
  await assert.rejects(fetchConcentration(DAOS.comp,'test'),/Invalid token units/)
})
