// Real on-chain Governor DAOs used for the live GASS demo.
// Addresses are public and verifiable on Etherscan. `treasury` is the
// timelock/treasury contract that actually holds the funds a passed
// governance proposal can move (this is the "value at risk").
//
// Shared by the frontend (labels + picker) and the scoring backend.

export const DAOS = {
  comp: {
    id: 'comp',
    name: 'Compound',
    ticker: 'COMP',
    chain: 'eth-mainnet',
    token: '0xc00e94Cb662C3520282E6f5717214004A7f26888', // COMP
    treasury: '0x6d903f6003cca6255D85CcA4D3B5E5146dC33925', // Timelock
    governor: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529', // GovernorBravo
    quorumTokens: 400_000, // COMP needed for quorum (public governance param)
  },
  uni: {
    id: 'uni',
    name: 'Uniswap',
    ticker: 'UNI',
    chain: 'eth-mainnet',
    token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    treasury: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC', // Timelock
    governor: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3', // Governor Bravo
    quorumTokens: 40_000_000, // UNI needed for quorum
  },
  ens: {
    id: 'ens',
    name: 'ENS',
    ticker: 'ENS',
    chain: 'eth-mainnet',
    token: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', // ENS
    treasury: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7', // DAO Wallet / Timelock
    governor: '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3', // Governor
    // ENS uses a fraction-of-supply quorum, so resolve it against live supply.
    quorumFraction: 0.01, // ~1% of supply
  },
}

// Coverage entries must not silently inherit a generic quorum assumption.
const research = [
  {
    "id": "forth",
    "name": "Ampleforth",
    "ticker": "FORTH",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "lido",
    "name": "Lido",
    "ticker": "LDO",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "aave",
    "name": "Aave",
    "ticker": "AAVE",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "nouns",
    "name": "Nouns",
    "ticker": "NOUN",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "frax",
    "name": "Frax",
    "ticker": "FXS",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "gitcoin",
    "name": "Gitcoin",
    "ticker": "GTC",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "balancer",
    "name": "Balancer",
    "ticker": "BAL",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "radworks",
    "name": "Radworks",
    "ticker": "RAD",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "euler",
    "name": "Euler",
    "ticker": "EUL",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "maker",
    "name": "MakerDAO / Sky",
    "ticker": "MKR / SKY",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "instadapp",
    "name": "Instadapp",
    "ticker": "INST",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "hop",
    "name": "Hop",
    "ticker": "HOP",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "truefi",
    "name": "TrueFi",
    "ticker": "TRU",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "cryptex",
    "name": "Cryptex",
    "ticker": "CTX",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "angle",
    "name": "Angle",
    "ticker": "ANGLE",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  },
  {
    "id": "silo",
    "name": "Silo",
    "ticker": "SILO",
    "chain": "eth-mainnet",
    "status": "research",
    "missing": [
      "Verified treasury and governor addresses",
      "Current quorum and voting rules",
      "Execution permissions and safeguards"
    ]
  }
]
for (const dao of research) DAOS[dao.id] = dao
Object.assign(DAOS.forth, {
  token: '0x77fba179c79de5b7653f68b5039af940ada60ce0',
  treasury: '0x223592a191ECfC7FDC38a9256c3BD96E771539A9',
  governor: '0x8a994C6F55Be1fD2B4d0dc3B8f8F7D4E3a2dA8F1',
  addressSource: 'https://github.com/fragmentsorg/Forth',
  missing: ['Current quorum and voting rules', 'Current treasury balances', 'Execution permissions and safeguards'],
})
export const DAO_LIST = Object.values(DAOS)
export const LIVE_DAO_LIST = DAO_LIST.filter((dao) => dao.status !== 'research')
