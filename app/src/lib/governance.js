import { Interface, formatUnits } from 'ethers'

const DEFAULT_RPC = 'https://ethereum-rpc.publicnode.com'

export async function rpc(method, params, fetcher = fetch) {
  const response = await fetcher(process.env.ETHEREUM_RPC_URL || DEFAULT_RPC, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(8000), redirect: 'error',
  })
  if (!response.ok) throw new Error('Ethereum RPC unavailable')
  const body = await response.json()
  if (body.error || body.result == null) throw new Error('Ethereum contract read failed')
  return body.result
}

export async function read(address, signature, args = [], block = 'latest', fetcher = fetch) {
  const abi = new Interface([`function ${signature}`])
  const fn = abi.fragments[0]
  const result = await rpc('eth_call', [{ to: address.toLowerCase(), data: abi.encodeFunctionData(fn, args) }, block], fetcher)
  return abi.decodeFunctionResult(fn, result)[0]
}

// A failed selector is not a zero value. Different governance families expose
// different methods; callers receive null when the requested capability is absent.
export async function optionalRead(address, signatures, args = [], block = 'latest', fetcher = fetch) {
  for (const signature of signatures) {
    try { return await read(address, signature, args, block, fetcher) } catch { /* Try the next documented ABI. */ }
  }
  return null
}

export async function readGovernance(dao, fetcher = fetch) {
  const block = await rpc('eth_blockNumber', [], fetcher)
  const blockNumber = Number(BigInt(block))
  let governor = dao.governor || null
  if (dao.resolveGovernorFromTimelock) {
    governor = await read(dao.treasuries[0].address, 'admin() view returns (address)', [], block, fetcher)
    if (/^0x0{40}$/i.test(governor)) throw new Error('Timelock has no governor')
  }
  const base = { blockNumber, governor, model: dao.governanceModel, quorumTokens: null, quorumMethod: null, delaySeconds: null }
  const delayAddress = dao.timelock || (dao.resolveGovernorFromTimelock ? dao.treasuries[0]?.address : null)
  if (delayAddress) {
    const delay = await optionalRead(delayAddress, ['delay() view returns (uint256)', 'getMinDelay() view returns (uint256)'], [], block, fetcher)
    base.delaySeconds = delay == null ? null : Number(delay)
  }
  if (dao.governanceModel === 'token-vote' && governor) {
    const decimals = Number(await read(dao.token, 'decimals() view returns (uint8)', [], block, fetcher))
    let raw = await optionalRead(governor, ['quorumVotes() view returns (uint256)'], [], block, fetcher)
    let method = 'quorumVotes()'
    if (raw == null) {
      // OZ governors may use a block or timestamp clock. Read clock() where present.
      const clock = await optionalRead(governor, ['clock() view returns (uint48)'], [], block, fetcher)
      const timepoint = (clock ?? BigInt(blockNumber)) - 1n
      raw = await read(governor, 'quorum(uint256) view returns (uint256)', [timepoint], block, fetcher)
      method = 'quorum(clock - 1)'
    }
    base.quorumTokens = Number(formatUnits(raw, decimals))
    if (!(base.quorumTokens > 0) || !Number.isFinite(base.quorumTokens)) throw new Error('Invalid live quorum')
    base.quorumMethod = method
  } else if (dao.governanceModel === 'aragon' && governor) {
    const [pct, supply, decimals] = await Promise.all([
      read(governor, 'minAcceptQuorumPct() view returns (uint64)', [], block, fetcher),
      read(dao.token, 'totalSupply() view returns (uint256)', [], block, fetcher),
      read(dao.token, 'decimals() view returns (uint8)', [], block, fetcher),
    ])
    base.quorumTokens = Number(formatUnits(supply * pct / 10n ** 18n, Number(decimals)))
    base.quorumMethod = 'minAcceptQuorumPct() × totalSupply()'
  } else if (dao.governanceModel === 'nft-vote' && governor) {
    const raw = await optionalRead(governor, ['minQuorumVotes() view returns (uint256)', 'quorumVotes() view returns (uint256)'], [], block, fetcher)
    base.quorumTokens = raw == null ? null : Number(raw)
    base.quorumMethod = raw == null ? null : 'Minimum quorum; opposition can increase the requirement'
  }
  if (dao.governanceModel === 'multisig' && dao.treasuries.length) {
    const address = dao.treasuries[0].address
    const threshold = await optionalRead(address, ['getThreshold() view returns (uint256)'], [], block, fetcher)
    const owners = await optionalRead(address, ['getOwners() view returns (address[])'], [], block, fetcher)
    base.signerThreshold = threshold == null ? null : Number(threshold)
    base.signerCount = owners?.length ?? null
  }
  return base
}
