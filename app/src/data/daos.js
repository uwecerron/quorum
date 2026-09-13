// Ethereum deployment registry. Source URLs are evidence, never executable instructions.
// All entries drive live GoldRush reads; governance adapters reflect different voting models.
export const DAO_LIST = [
  {
    "id": "forth",
    "name": "Ampleforth",
    "ticker": "FORTH",
    "chain": "eth-mainnet",
    "token": "0x77fba179c79de5b7653f68b5039af940ada60ce0",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "DAO Timelock",
        "address": "0x223592a191ECfC7FDC38a9256c3BD96E771539A9"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://github.com/fragmentsorg/Forth",
    "note": ""
  },
  {
    "id": "gitcoin",
    "name": "Gitcoin",
    "ticker": "GTC",
    "chain": "eth-mainnet",
    "token": "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "DAO Timelock",
        "address": "0x57a8865cfB1eCEf7253c27da6B4BC3dAEE5Be518"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://github.com/gitcoinco/governance-docs",
    "note": "Governor is resolved from the timelock admin on every scan. Timelock balances do not include funds moved to other wallets."
  },
  {
    "id": "radworks",
    "name": "Radworks",
    "ticker": "RAD",
    "chain": "eth-mainnet",
    "token": "0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "DAO Timelock",
        "address": "0x8dA8f82d2BbDd896822de723F55D6EdF416130ba"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://docs.radworks.org/governance/overview/",
    "note": ""
  },
  {
    "id": "comp",
    "name": "Compound",
    "ticker": "COMP",
    "chain": "eth-mainnet",
    "token": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Timelock",
        "address": "0x6d903f6003cca6255D85CcA4D3B5E5146dC33925"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://docs.compound.finance/v2/governance/",
    "note": ""
  },
  {
    "id": "uni",
    "name": "Uniswap",
    "ticker": "UNI",
    "chain": "eth-mainnet",
    "token": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Timelock",
        "address": "0x1a9C8182C09F50C8318d769245beA52c32BE35BC"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments",
    "note": ""
  },
  {
    "id": "ens",
    "name": "ENS",
    "ticker": "ENS",
    "chain": "eth-mainnet",
    "token": "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "DAO Timelock",
        "address": "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7"
      }
    ],
    "governanceModel": "token-vote",
    "governor": "0x323A76393544d5ecca80cd6ef2A560C6a395b7E3",
    "resolveGovernorFromTimelock": false,
    "timelock": "0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7",
    "source": "https://docs.ens.domains/dao/",
    "note": ""
  },
  {
    "id": "lido",
    "name": "Lido",
    "ticker": "LDO",
    "chain": "eth-mainnet",
    "token": "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Aragon Agent",
        "address": "0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      }
    ],
    "governanceModel": "aragon",
    "governor": "0x2e59A20f205bB85a89C53f1936454680651E618e",
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://docs.lido.fi/deployed-contracts/",
    "note": "Minimum acceptance quorum is read from Aragon. Other approval and execution conditions still apply."
  },
  {
    "id": "aave",
    "name": "Aave",
    "ticker": "AAVE",
    "chain": "eth-mainnet",
    "token": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Collector",
        "address": "0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c"
      },
      {
        "label": "Ecosystem Reserve",
        "address": "0x25F2226B597E8F9514B3F68F00f494cF4f286491",
        "source": "https://github.com/bgd-labs/aave-address-book/blob/main/src/MiscEthereum.sol"
      }
    ],
    "governanceModel": "multi-asset-vote",
    "governor": "0x9AEE0B04504CeF83A65AC3f0e838D0593BCb2BC7",
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://github.com/bgd-labs/aave-address-book/blob/main/src/GovernanceV3Ethereum.sol",
    "note": "Governance v3 supports multiple voting assets and access levels. AAVE ownership alone is not a quorum-cost model."
  },
  {
    "id": "nouns",
    "name": "Nouns",
    "ticker": "NOUN",
    "chain": "eth-mainnet",
    "token": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    "tokenKind": "erc721",
    "treasuries": [
      {
        "label": "DAO Executor",
        "address": "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71"
      }
    ],
    "governanceModel": "nft-vote",
    "governor": "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    "resolveGovernorFromTimelock": false,
    "timelock": "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71",
    "source": "https://github.com/nounsDAO/nouns-monorepo",
    "note": "Each Noun is an NFT vote; minimum quorum increases with opposition. No fungible spot-price capture estimate is calculated."
  },
  {
    "id": "frax",
    "name": "Frax",
    "ticker": "FRAX",
    "chain": "eth-mainnet",
    "token": "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Ethereum Comptroller",
        "address": "0xB1748C79709f4Ba2Dd82834B8c82D4a505003f27"
      }
    ],
    "governanceModel": "multisig",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://docs.frax.finance/frax-v1-original/core-frax-multisigs",
    "note": "FRAX is the renamed FXS governance asset, not frxUSD. veFRAX voting and multisig execution cannot be modeled as buying a fixed percentage of FRAX."
  },
  {
    "id": "balancer",
    "name": "Balancer",
    "ticker": "BAL",
    "chain": "eth-mainnet",
    "token": "0xba100000625a3754423978a60c9317c58a424e3D",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Treasury Safe",
        "address": "0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89"
      },
      {
        "label": "DAO Admin Safe",
        "address": "0x10a19e7ee7d7f8a52822f6817de8ea18204f2e4f"
      }
    ],
    "governanceModel": "multisig",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859",
    "note": "veBAL voting power differs from BAL balances. Safe signer thresholds are read onchain."
  },
  {
    "id": "euler",
    "name": "Euler",
    "ticker": "EUL",
    "chain": "eth-mainnet",
    "token": "0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Foundation Treasury",
        "address": "0xC7C5aFDB61e08BE3e2FB09098412b5706EB5c550"
      },
      {
        "label": "Legacy Treasury / Operations",
        "address": "0x25Aa4a183800EcaB962d84ccC7ada58d4e126992"
      }
    ],
    "governanceModel": "multisig",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://docs.euler.finance/euler-dao/treasury/",
    "note": "The current treasury and legacy operations wallet are shown separately; voting and Safe execution are separate steps."
  },
  {
    "id": "maker",
    "name": "MakerDAO / Sky",
    "ticker": "SKY",
    "chain": "eth-mainnet",
    "token": "0x56072C95FAA701256059aa122697B133aDEd9279",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Pause Proxy",
        "address": "0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB"
      }
    ],
    "governanceModel": "approval-vote",
    "governor": "0x929d9A1435662357F54AdcF64DcEE4d6b867a6f9",
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://github.com/sky-ecosystem/spells-mainnet/blob/master/src/test/addresses_mainnet.sol",
    "note": "SKY is the current governance token. Continuous approval voting has no fixed quorum equivalent."
  },
  {
    "id": "instadapp",
    "name": "Instadapp / Fluid",
    "ticker": "FLUID",
    "chain": "eth-mainnet",
    "token": "0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Governance Timelock",
        "address": "0xC7Cb1dE2721BFC0E0DA1b9D526bCdC54eF1C0eFC"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://blog.instadapp.io/inst/",
    "note": "Original INST token address; current token metadata is read from the chain."
  },
  {
    "id": "hop",
    "name": "Hop",
    "ticker": "HOP",
    "chain": "eth-mainnet",
    "token": "0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "DAO Timelock",
        "address": "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a",
        "source": "https://forum.hop.exchange/t/list-of-important-addresses/693"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": "0xeeA8422a08258e73c139Fc32a25e10410c14bd7a",
    "source": "https://github.com/hop-protocol/hop/blob/develop/packages/sdk/src/addresses/mainnet.ts",
    "note": "Live HOP holders and price. Bridge custody balances are never substituted for a DAO treasury."
  },
  {
    "id": "truefi",
    "name": "TrueFi",
    "ticker": "TRU",
    "chain": "eth-mainnet",
    "token": "0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Governance Timelock",
        "address": "0xC4CA6d752cd6997022dd9B9C5709690CA6a079d8"
      }
    ],
    "governanceModel": "staked-vote",
    "governor": "0x0236c16f06aAFdbea5b5EDC8C326A479DB090eB2",
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://github.com/trusttoken/smart-contracts/blob/master/deployments-mainnet.json",
    "note": "TRU ownership differs from staked governance voting power; lending-pool assets are not counted as treasury holdings."
  },
  {
    "id": "cryptex",
    "name": "Cryptex",
    "ticker": "CTX",
    "chain": "eth-mainnet",
    "token": "0x321C2fE4446C7c963dc41Dd58879AF648838f98D",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Timelock",
        "address": "0xa54074b2cc0e96a43048d4a68472F7F046aC0DA8"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://docs.cryptex.finance/deployed-contracts/",
    "note": ""
  },
  {
    "id": "angle",
    "name": "Angle",
    "ticker": "ANGLE",
    "chain": "eth-mainnet",
    "token": "0x31429d1856aD1377A8A0079410B297e1a9e214c2",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Governance multisig",
        "address": "0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8",
        "source": "https://github.com/AngleProtocol/angle-governance"
      }
    ],
    "governanceModel": "staked-vote",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://developers.angle.money/overview/smart-contracts/mainnet-contracts",
    "note": "Governance multisig balances and ANGLE holders only. Locked/delegated voting power is not equivalent to liquid ANGLE; no fungible quorum-cost score is calculated."
  },
  {
    "id": "silo",
    "name": "Silo",
    "ticker": "SILO",
    "chain": "eth-mainnet",
    "token": "0xF0B2dd79324A66d2108C961d680F7616E1486bB0",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Ethereum DAO account (v2 registry)",
        "address": "0xE8e8041cB5E3158A0829A19E014CA1cf91098554",
        "source": "https://github.com/silo-finance/silo-contracts-v2/blob/master/common/addresses/mainnet.json"
      }
    ],
    "governanceModel": "staked-vote",
    "governor": null,
    "resolveGovernorFromTimelock": false,
    "timelock": null,
    "source": "https://docs.silo.finance/docs/users/tokenomics/silo-token/",
    "note": "Uses the migrated SILO token. Governance belongs to xSILO holders; old SILO balances are not used."
  },
  {
    "id": "inverse",
    "name": "Inverse Finance",
    "ticker": "INV",
    "chain": "eth-mainnet",
    "token": "0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Anchor Treasury Timelock",
        "address": "0x926dF14a23BE491164dCF93f4c468A50ef659D5B"
      }
    ],
    "governanceModel": "token-vote",
    "governor": null,
    "resolveGovernorFromTimelock": true,
    "timelock": null,
    "source": "https://github.com/InverseFinance/inverse-web",
    "note": ""
  },
  {
    "id": "zeroex",
    "name": "0x Protocol",
    "ticker": "ZRX",
    "chain": "eth-mainnet",
    "token": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    "tokenKind": "erc20",
    "treasuries": [
      {
        "label": "Treasury Timelock",
        "address": "0x0dcfb77a581bc8fe432e904643a5480cc183f38d"
      }
    ],
    "governanceModel": "wrapped-vote",
    "governor": "0x4822cfc1e7699bdb9551bdfd3a838ee414bc2008",
    "resolveGovernorFromTimelock": false,
    "timelock": "0x0dcfb77a581bc8fe432e904643a5480cc183f38d",
    "source": "https://github.com/0xProject/protocol/tree/development/contracts/governance",
    "note": "Governance uses wrapped/delegated ZRX. Plain ZRX concentration does not establish voting control."
  }
]

export const DAOS = Object.fromEntries(DAO_LIST.map((dao) => [dao.id, dao]))
export const LIVE_DAO_LIST = DAO_LIST
