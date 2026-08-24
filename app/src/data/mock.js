// All data in this file is illustrative / simulated for demo purposes.
// The "Incident 003" case study numbers are drawn from public post-incident
// reporting on a real Aug 23 2026 DAO governance capture (protocol name withheld
// by design, see note in Landing.jsx). Dollar figures and mechanics are real;
// the protocol identity is deliberately not attached to this product.

export const protocols = [
  {
    id: 'incident-003',
    name: 'Incident 003',
    ticker: 'REDACTED',
    gass: 82,
    trend: 'up',
    treasury: 41_200_000,
    status: 'breached',
    statusLabel: 'Breached Aug 23',
    turnout: 11,
    timelockHrs: 0,
    guardian: 'none configured',
    note: 'Governance capture executed against a live DeFi vault protocol. $8.5M drained across 4 USDC vaults plus an ETH meta vault. The name is withheld because the pattern matters more than the target.',
  },
  {
    id: 'harbor-dao',
    name: 'Harbor DAO',
    ticker: 'HRBR',
    gass: 74,
    trend: 'up',
    treasury: 18_600_000,
    status: 'critical',
    statusLabel: 'Threshold approach',
    turnout: 14,
    timelockHrs: 6,
    guardian: '2-of-5 multisig',
    note: 'Wallet 0x7fA2… crossed 41% of quorum-passing stake in the last 36h, funded via bridge from a mixer-linked address.',
  },
  {
    id: 'meridian-credit',
    name: 'Meridian Credit',
    ticker: 'MRDN',
    gass: 58,
    trend: 'flat',
    treasury: 63_400_000,
    status: 'elevated',
    statusLabel: 'Elevated exposure',
    turnout: 19,
    timelockHrs: 24,
    guardian: '3-of-7 multisig',
    note: 'Thin float on governance token; capture cost has drifted down 22% over the last quarter as liquidity thinned.',
  },
  {
    id: 'vellum-protocol',
    name: 'Vellum Protocol',
    ticker: 'VLM',
    gass: 33,
    trend: 'down',
    treasury: 9_800_000,
    status: 'watch',
    statusLabel: 'Nominal',
    turnout: 38,
    timelockHrs: 48,
    guardian: '4-of-6 multisig + veto council',
    note: 'Healthy turnout, deep timelock, active guardian council. Capture cost currently exceeds treasury value.',
  },
  {
    id: 'northstar-yield',
    name: 'Northstar Yield',
    ticker: 'NSY',
    gass: 21,
    trend: 'flat',
    treasury: 5_100_000,
    status: 'watch',
    statusLabel: 'Nominal',
    turnout: 46,
    timelockHrs: 72,
    guardian: '5-of-9 multisig + veto council',
    note: 'Broad, organic holder distribution. No anomalous accumulation detected.',
  },
]

export const factors = [
  { key: 'Concentration', value: 'Voting power Gini/HHI across holders + delegates' },
  { key: 'Capture cost', value: '$ needed at current liquidity to pass quorum' },
  { key: 'Quorum vs. supply', value: 'Threshold relative to liquid, tradeable tokens' },
  { key: 'Timelock depth', value: 'Delay between a passed vote and execution' },
  { key: 'Guardian coverage', value: 'Emergency pause/veto authority, and over what' },
  { key: 'Turnout history', value: 'How much of the electorate typically shows up' },
]

// Reconstructed Incident 003 timeline: "what happened" vs. "what Sentinel would
// have surfaced at each step, had it been monitoring this protocol."
export const incidentReplay = [
  {
    t: 'T+0',
    actual: '2 ETH leaves Tornado Cash and buys governance tokens.',
    sentinel: 'Wallet flagged on first transfer: mixer-funded, zero prior history.',
    severity: 'info',
  },
  {
    t: 'T+1',
    actual: 'Voting power climbs past quorum in 4 of 5 USDC vaults. No one is watching.',
    sentinel: 'GASS spikes 41 → 82. Wallet crosses capture-cost threshold on 4 vaults. Alert sent to protocol + on-call.',
    severity: 'warn',
  },
  {
    t: 'T+2',
    actual: 'Proposal to self-send vault funds goes live.',
    sentinel: 'Proposal simulated on submission: fund transfer, sole beneficiary is the flagged wallet. Marked critical.',
    severity: 'critical',
  },
  {
    t: 'T+3',
    actual: 'Voted yes by the only wallet that matters. Executed. $8.5M gone.',
    sentinel: 'Guardian Response Network paged at T+2. Veto window still open, so execution never clears the timelock.',
    severity: 'resolved',
  },
]

export const alertFeedSeed = [
  { id: 1, protocol: 'Harbor DAO', level: 'warn', msg: 'Wallet 0x7fA2…c91d now holds 41% of quorum-passing stake (+9% in 6h).', age: '4m ago' },
  { id: 2, protocol: 'Meridian Credit', level: 'info', msg: 'Governance token liquidity depth down 6% week-over-week.', age: '22m ago' },
  { id: 3, protocol: 'Harbor DAO', level: 'critical', msg: 'Funding trace: wallet 0x7fA2…c91d received initial capital via Tornado Cash.', age: '41m ago' },
  { id: 4, protocol: 'Vellum Protocol', level: 'info', msg: 'Quarterly turnout report: 38% average, no anomalies.', age: '3h ago' },
  { id: 5, protocol: 'Incident 003', level: 'critical', msg: 'Post-incident: 2,843 ETH + 1.68M USDC confirmed moved, swapped to DAI.', age: '1d ago' },
]

export function formatUsd(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}
