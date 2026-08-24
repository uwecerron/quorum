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
    quorumTokens: 1_000_000, // ENS needed for quorum (approx)
  },
}

export const DAO_LIST = Object.values(DAOS)
