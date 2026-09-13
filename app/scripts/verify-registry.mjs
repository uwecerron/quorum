// Read-only deployment verification. No signing keys or GoldRush key required.
import { writeFile } from 'node:fs/promises'
import { DAO_LIST } from '../src/data/daos.js'
import { read, rpc, readGovernance } from '../src/lib/governance.js'
const results = []
for (let i = 0; i < DAO_LIST.length; i += 3) {
  await Promise.all(DAO_LIST.slice(i, i + 3).map(async (dao) => {
    const entry = { id: dao.id, source: dao.source }
    try {
      entry.tokenCodePresent = (await rpc('eth_getCode', [dao.token.toLowerCase(), 'latest'])) !== '0x'
      entry.symbol = await read(dao.token, 'symbol() view returns (string)')
      entry.decimals = dao.tokenKind === 'erc721' ? 0 : Number(await read(dao.token, 'decimals() view returns (uint8)'))
      entry.totalSupplyRaw = (await read(dao.token, 'totalSupply() view returns (uint256)')).toString()
      entry.governance = await readGovernance(dao)
      entry.wallets = await Promise.all(dao.treasuries.map(async (wallet) => ({ ...wallet, codePresent: (await rpc('eth_getCode', [wallet.address.toLowerCase(), 'latest'])) !== '0x' })))
    } catch (error) { entry.error = error.message }
    results.push(entry)
    console.log(dao.id, entry.symbol || 'unavailable', entry.governance?.quorumTokens ?? 'no comparable quorum', entry.error || '')
  }))
}
await writeFile(new URL('../../security/live-registry-verification.json', import.meta.url), JSON.stringify({ checkedAt: new Date().toISOString(), scope: 'Read-only RPC; GoldRush balances and pricing are not verified by this script', results }, null, 2)+'\n')
if(results.some((entry) => entry.error || !entry.tokenCodePresent)) process.exitCode = 1
