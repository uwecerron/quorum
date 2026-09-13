# Quorum Sentinel

React/Vite app with a server-side `/api/gass` endpoint. Both `/` and `/dashboard` share a searchable live protocol selector with 21 Ethereum integrations.

## Live coverage

Ampleforth (FORTH), Gitcoin, Radworks, Compound, Uniswap, ENS, Lido, Aave, Nouns, Frax, Balancer, Euler, MakerDAO/Sky, Instadapp/Fluid, Hop, TrueFi, Cryptex, Angle, Silo, Inverse Finance and 0x Protocol.

The registry in `src/data/daos.js` contains the protocols from the supplied scan plus FORTH, Inverse and 0x. Each entry drives GoldRush token-holder and configured account-balance requests. Aave's Collector and Ecosystem Reserve are separate accounts. Treasury totals cover only listed Ethereum accounts; they are not total protocol assets or governance-reachable funds. Per-account sources and holdings are exposed in the result.

`src/lib/governance.js` reads Ethereum contracts at a recorded block. Compound-style timelocks resolve their current governor through `admin()`. Adapters support fixed token quorum, OpenZeppelin clock-based quorum, Aragon minimum acceptance, Nouns minimum NFT quorum and Safe signer thresholds. GASS is computed only for supported fungible voting models with valid holder, price and quorum data. Other models still show live holders and balances, with an explanation of why no comparable score is produced. Hop's governor is not configured; its token and timelock balances are integrated. Staked, wrapped and multi-asset voting models need dedicated voting-power adapters before scoring.

GoldRush by Covalent powers holder distribution, treasury balances and spot pricing through `api.covalenthq.com/v1`. Governance parameters come from Ethereum RPC. This describes the implementation, not a sponsorship. Keys stay server-side.

The score combines spot-price-times-quorum, sampled holder concentration and quorum share of supply. It excludes liquidity/slippage, delegation, turnout, opposition, vetoes and execution permissions. It does not establish a vulnerability, control cost or treasury reachability. Missing inputs remain unavailable rather than becoming zero. Partial treasury refreshes preserve individual accounts but suppress the aggregate.

## Run

```sh
npm install
npm run dev              # frontend only
npm test
npm run lint
npm run build
```

Use `vercel dev` for the API locally, or deploy `app/` as the Vercel project root. Configure server-side `GOLDRUSH_API_KEY`. Optionally set `ETHEREUM_RPC_URL`; the default is the public Ethereum PublicNode endpoint. Neither variable should have a `VITE_` prefix.

```sh
npm run score -- forth gitcoin radworks
npm run leaderboard
npm run verify:registry
```

The score and leaderboard commands require the GoldRush key. Registry verification performs read-only public RPC calls and writes `../security/live-registry-verification.json`; it verifies token contracts, wallet code and supported governance reads, not GoldRush availability. Tests use provider fixtures and do not substitute fixture data in production. Live GoldRush responses still require a configured key to validate end to end.

## Historical material

`src/data/coverage.json` preserves the supplied scan as a historical source artifact. It is not used for live results. The separate illustrative dashboard portfolio/replay remains demo content. The old research catalogue component has been removed; all selector entries now invoke the live endpoint.
