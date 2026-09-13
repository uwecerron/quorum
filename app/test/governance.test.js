import test from 'node:test'
import assert from 'node:assert/strict'
import { Interface } from 'ethers'
import { readGovernance } from '../src/lib/governance.js'
import { DAOS } from '../src/data/daos.js'
function fixture(entries,inspect=()=>{}) {
 const routes=entries.map(([signature,value])=>{const abi=new Interface([`function ${signature}`]);return {abi,fn:abi.fragments[0],value}})
 return async(_,options)=>{
  assert.equal(options.redirect,'error')
  assert.ok(options.signal instanceof AbortSignal)
  const body=JSON.parse(options.body)
  if(body.method==='eth_blockNumber')return {ok:true,json:async()=>({result:'0x100'})}
  const call=body.params[0];inspect(call,body.params[1])
  const route=routes.find(r=>call.data.startsWith(r.fn.selector))
  return {ok:true,json:async()=>route ? {result:route.abi.encodeFunctionResult(route.fn,[route.value])} : {error:{message:'unsupported selector'}}}
 }
}
test('timelock admin is resolved dynamically and quorum honors token decimals',async()=>{
 const governor='0x1111111111111111111111111111111111111111'
 const addresses=[]
 const result=await readGovernance(DAOS.forth,fixture([
  ['admin() view returns(address)',governor],['delay() view returns(uint256)',86400n],
  ['decimals() view returns(uint8)',8],['quorumVotes() view returns(uint256)',60000000000000n],
 ],(call,block)=>{addresses.push(call.to);assert.equal(block,'0x100')}))
 assert.equal(result.quorumTokens,600000)
 assert.equal(result.governor,governor)
 assert.equal(result.delaySeconds,86400)
 assert.ok(addresses.includes(governor))
})
test('OZ quorum uses timestamp clock rather than assuming block units',async()=>{
 const quorum=new Interface(['function quorum(uint256) view returns(uint256)'])
 const result=await readGovernance(DAOS.ens,fixture([
  ['decimals() view returns(uint8)',18],['clock() view returns(uint48)',2000000000n],
  ['quorum(uint256) view returns(uint256)',1000000n*10n**18n],
 ],call=>{if(call.data.startsWith(quorum.getFunction('quorum').selector))assert.equal(quorum.decodeFunctionData('quorum',call.data)[0],1999999999n)}))
 assert.equal(result.quorumTokens,1000000)
})
test('Aragon percentage converts supply units while NFT quorum stays an integer',async()=>{
 const lido=await readGovernance(DAOS.lido,fixture([
  ['minAcceptQuorumPct() view returns(uint64)',5n*10n**16n],
  ['totalSupply() view returns(uint256)',1000000000n*10n**18n],['decimals() view returns(uint8)',18],
 ]))
 assert.equal(lido.quorumTokens,50000000)
 const nouns=await readGovernance(DAOS.nouns,fixture([['minQuorumVotes() view returns(uint256)',136n]]))
 assert.equal(nouns.quorumTokens,136)
})
test('Safe signer threshold is independent from token voting quorum',async()=>{
 const result=await readGovernance(DAOS.frax,fixture([
  ['getThreshold() view returns(uint256)',2n],
  ['getOwners() view returns(address[])',Array.from({length:3},(_,i)=>'0x'+String(i+1).padStart(40,'0'))],
 ]))
 assert.equal(result.signerThreshold,2)
 assert.equal(result.signerCount,3)
 assert.equal(result.quorumTokens,null)
})
