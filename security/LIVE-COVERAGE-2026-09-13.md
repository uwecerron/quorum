# Live integration validation — September 13, 2026

The live registry now contains 21 protocols and is used by both landing-page and dashboard selectors, the API and CLI. This supersedes the earlier three-live-plus-research implementation described in the prior review.

- Public Ethereum RPC verification succeeded for all token contracts and configured account bytecode. Supported governance parameters were read at recorded block numbers. See `live-registry-verification.json` for exact results, source URLs and scope.
- Ampleforth: 600,000 FORTH quorum; Gitcoin: 2,500,000 GTC; Radworks: 4,000,000 RAD. These are read-time parameters, not permanent constants. Their governors are resolved from timelock admins on each refresh.
- Fifteen automated tests pass: registry coverage, GoldRush request paths for every entry, API acceptance, partial balances, governance failures, token decimals, timestamp clocks, Aragon and NFT quorum, Safe thresholds and API security regressions.
- Production build passes. Lint has one pre-existing warning in ReplayTimeline.jsx. Runtime dependency audit reports zero known vulnerabilities.
- No GoldRush key was available for live response validation. Provider tests use explicit fixtures; production has no fixture fallback. RPC verification is not an end-to-end GoldRush test.

Coverage is Ethereum-only and limited to configured accounts. Some governance models intentionally have no GASS: staked/wrapped voting power, multi-asset voting, NFTs, approval voting and multisigs are not interchangeable with a liquid-token quorum. Hop has live holder/timelock balance reads but no configured governor adapter. No contract exploit or DAO vulnerability is established by these checks.

Requests remain read-only. Upstream timeouts, redirect rejection, API input validation, generic errors and bounded per-instance caching remain in place. Cross-instance rate limiting remains a deployment concern.
