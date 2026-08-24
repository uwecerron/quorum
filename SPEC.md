# Quorum Sentinel — Product & Business Spec (v2)
### Governance Attack Surface Monitoring for DAOs & DeFi Treasuries

**Tagline:** *We watch the vote, not just the code.*

**What this is:** a for-profit product I'm building and launching through Traders Guild — a network I run — on top of Covalent/GoldRush data, a Guild client. This is not a request for help. It's a plan that uses assets I already control (the network, the Covalent relationship) as the unfair advantage. Every protocol referenced by name has been anonymized to "Incident 003"; the pattern is the point, not any one team.

---

## 1. The trigger, and the honest market

On **August 23, 2026**, an attacker drained **$8.5M** from a DeFi protocol's vaults without touching a line of audited code:

- Started with **2 ETH** out of Tornado Cash, bought governance tokens.
- That bought **100% voting control of 4 of 5 USDC vaults** and **~91% of an ETH meta vault**.
- Proposed sending the vault funds to himself. Voted yes. Executed.
- **2,843 ETH (~$6.87M) + 1.68M USDC** gone, swapped to DAI, unfreezable.
- PeckShield and CertiK confirmed on-chain: audited, no reentrancy, no oracle manipulation, no leaked keys.

Root cause: **architectural** — thin governance-token liquidity, voter apathy, and no access controls on vault functions. It's the **3rd governance-capture attack this year** (prior class: Beanstalk $182M 2022, Build Finance $470K 2022). **Every dollar spent on code audits does nothing to stop it. There is no auditor for governance.**

**Read the market honestly.** Governance is *consolidating and professionalizing*, not booming. In March 2026 **Tally — the leading on-chain DAO governance platform (1M+ users, $1B+ processed) — shut down**, its CEO blaming regulatory clarity for making decentralization "optional." Snapshot (off-chain signaling) has ~96% adoption among major DAOs. Roughly 12,000 "DAOs" exist, ~$28B in treasuries, but average turnout is ~17% and ~78% of governance tokens sit with the top 20% of holders. So: thin float + apathy + reachable treasury = capturable — but the buyer is a *smaller, higher-stakes, more professional* set than the headline implies. This is insurance sold into a contracting pool, not a growth land-grab. Priced and targeted correctly, it's a real business.

---

## 2. Who we sell to (ICP, precisely)

**On-chain, token-weighted Governor DAOs with executable treasury proposals** — Compound/OpenZeppelin-Governor-style, where a token vote can directly move funds. Treasury **$5M–$100M**, active governance, thin enough float to be capturable, and ideally recently spooked by an incident. Not Snapshot-only shells (off-chain, advisory, Safe-executed — a different attack via signer compromise, a different product later). The serviceable set is **~200–400 protocols**, not 12,000.

---

## 3. The product

A monitoring and rating layer for governance-capture risk — the gap the incumbents (§7) leave wide open.

### 3.1 GASS — the Governance Attack Surface Score (the core product)
A continuously-recomputed **0–100 rating** of how cheaply someone could legally buy control of a protocol's treasury right now. Run as a **rating**, not a real-time SOC (see §4 for why). Factors:

| Factor | What it measures | Live from GoldRush today? |
|---|---|---|
| Concentration | Voting-power Gini/HHI + top-holder share | ✅ token holders |
| Value at risk | Treasury/vault $ reachable by a passed vote | ✅ address balances |
| Capture cost | $ to buy quorum-passing power at real liquidity | 🟡 price yes, needs DEX slippage source |
| Quorum vs. liquid supply | Threshold vs. tradeable float | 🟡 supply + a contract read |
| Timelock depth | Delay between passed vote and execution | 🟡 contract read |
| Guardian coverage | Emergency pause/veto authority, over what | 🟡 events + manual |
| Turnout history | Electorate participation (apathy proxy) | ✅ vote events |

A free **public** GASS score for every in-scope DAO (reach + a network-effect moat once the market quotes it); the rated protocol pays for the private drill-down, alerting, and monitoring. See §8 for the live GoldRush build.

### 3.2 Wallet & delegation monitoring
Flags fresh/mixer-funded wallets accelerating toward a quorum-passing stake, and sybil-shaped delegation clusters. One input among many — never the sole trigger (evasion is trivial via CEX/bridge funding).

### 3.3 Proposal simulation
On submission, fork state and simulate: what it moves, whose permissions change, and who's voting yes — cross-referenced against the wallet layer. Flags a self-dealing proposal **before the timelock starts**, not after execution. (Buy Tenderly; don't build it.)

### 3.4 Alerting into the customer's own controls
Alerts fire into the customer's **own Safe / OpenZeppelin Defender** — they hold the keys, we never do. A DAO handing a third party veto authority contradicts being a DAO; we're the smoke detector wired to the sprinkler they already own.

### 3.5 Governance red-team (the cash engine)
A **paid** hardening engagement: stress-test tokenomics, quorum, timelock length, guardian setup; deliver a plan. For the naked, high-risk protocols, "install a timelock + guardian" is step one — the precondition that makes monitoring worth buying. High-margin, funds the SaaS build, produces case studies.

### 3.6 Firewalled diligence feed (funds)
GASS scores + history as **pre-trade diligence** for funds and market makers. **Hard firewall:** never "attack live now, go short." Any in-progress event reaches the affected protocol first, and only enters any paid feed after a fixed public-disclosure delay. The feed sells *assessments*, not exploit signals. This resolves the single most dangerous conflict in the model.

---

## 4. The reframe that makes it defensible: sell a rating, not a SOC

Make the **standing GASS score the primary product**, on the S&P/Moody's **rated-entity-pays** model. Why this beats a real-time security-operations product:

- **Cheaper to run** — hourly/daily recompute, not sub-block streaming.
- **Legally cleaner** — a rating is a protected opinion, not a guarantee (cap liability in the ToS; "customer retains sole control of all on-chain actions").
- **Sidesteps the false-positive trap** — a standing structural measure, not a noisy event detector.
- **An actual moat** — a capture *detector* is a weekend of work for an incumbent to copy; a **trusted, adopted rating standard** is a data asset and a brand. The moat is the rating + distribution, never the code.

---

## 5. How I profit — three engines, one flywheel

This is the part that makes it not-charity. It isn't one P&L; it's a self-reinforcing loop across three:

1. **Sentinel's own revenue** — protocol subscriptions (recurring), red-team audits (high-margin one-time), and the firewalled diligence feed (recurring, a different buyer).
2. **Covalent consumption I'm mandated to grow** — my role in the Guild is to drive paying customers to Covalent's infra. **Every protocol Sentinel onboards becomes a paying Covalent consumer** (holders, balances, events, all queried through GoldRush). Sentinel is a customer-acquisition and consumption-driving machine for the exact infra I'm comped to grow.
3. **Referral / consumption economics** — formalize a referral fee or consumption rev-share on the Covalent usage Sentinel generates. A third line, on top of the first two.

**The flywheel:** the rating drives protocols onto Covalent → the Covalent relationship subsidizes Sentinel's data cost and co-markets it to Covalent's customers → cheaper, more-credible Sentinel signs more protocols → more Covalent consumption. Each turn lowers CAC and COGS while raising reach.

**Keep one wall clean:** the GASS methodology must be visibly **vendor-neutral**. It scores a protocol's governance risk — never "did you buy Covalent." The Covalent relationship is upstream (how data is sourced), never a variable in the score. Clean wall = the co-endorsement strengthens the rating instead of tainting it.

### Pricing (initial)

| Tier | Price | For |
|---|---|---|
| Public GASS score | Free | Every in-scope DAO — reach, inbound, the rating standard |
| Starter (self-serve) | $200–$500/mo per protocol | Private drill-down + basic alerts |
| Pro | $2,500–$5,000/mo per protocol | Full monitoring, proposal simulation, response SLA |
| Enterprise | Custom | Multi-protocol desks, dedicated response, white-label |
| Red-Team Audit | $25K–$150K one-time | Full tokenomics / quorum / timelock hardening |
| Diligence feed (funds) | $2K–$10K/mo | Firewalled rating + history for pre-trade screening |

Note the self-serve floor: Defimon sells real-time exploit alerts at **$200/mo self-serve with a free public channel**. Gating a $999 entry point behind a quarter-long enterprise cycle is how you never get adopted. Free public score + cheap self-serve at the bottom; enterprise pricing reserved for response and audits.

---

## 6. Realistic economics

Filter 12,000 DAOs to on-chain, token-voted, treasury-bearing, capturable **and** solvent → **~200–400 protocols**, in a consolidating segment.

**Base case, 18–24 months:** ~25–40 paying protocols at a blended ~$1.5K–$3K/mo (~$0.5M–$1.4M) + 4–8 hardening audits/yr at $40K–$120K (~$0.2M–$0.7M) + ~a dozen firewalled feed seats → **$0.7M–$1.5M ARR** from Sentinel alone, *before* the Covalent consumption/referral line. Owner-controlled, near-zero CAC via the Guild. (These are estimates from the turnout/concentration data, not a bottoms-up census — directional, not precise.)

**Two end-states:** (a) run it as a profitable niche SaaS-plus-services, keep 100%; or (b) the likelier upside — build the rating dataset + the logos an incumbent can't quickly clone, then sell the category to **Chainalysis/Hexagate, Hypernative, or OpenZeppelin**. They can add a detector in a weekend; they can't manufacture an adopted rating standard, your customer relationships, or the Covalent flywheel. That asymmetry is the exit.

---

## 7. Competition, honestly

| Player | Covers | Governance capture? |
|---|---|---|
| Hypernative | Enterprise AI detection across chains, automated response | No |
| Chainalysis Hexagate | ML anomaly detection, custom detector authoring | No |
| Forta Firewall | Inline transaction screening / blocking | No |
| BlockSec Phalcon | Monitoring + on-chain blocking | No |
| Defimon | Real-time exploit feed, self-serve $200/mo | No |
| OpenZeppelin Defender | Ops tooling (multisig, timelock execution) | No |
| **Quorum Sentinel** | **Governance-capture risk: who can legally vote your treasury away** | **Yes** |

The niche is genuinely open — none of the leading monitors score governance capture. But the neighborhood is crowded and the moat is thin: Hexagate ships custom-detector authoring, so the detector isn't defensible. The edge is **distribution (the Guild), the rating as an adopted reference, the Covalent flywheel, and first-mover category ownership** — not the code. A sophisticated Guild member already knows these names; don't pretend they aren't there.

---

## 8. The live proof point — GASS on GoldRush (built)

The demo is no longer fully mocked. A real GASS v0 computes from Covalent/GoldRush data for actual Governor DAOs:

- **Concentration** — `token_holders_v2` → top-holder share + HHI.
- **Value at risk** — `balances_v2` on the timelock/treasury address → USD reachable by a passed vote.
- **Capture-cost floor** — spot price × a share of supply (a naive floor, clearly labeled; the real number needs a DEX slippage source — 0x/1inch/Uniswap subgraph — as the next add).
- Combined into a transparent, weighted 0–100 with the components shown.

**Architecture (Vercel-native, key-safe):** a serverless function (`/api/gass`) reads `GOLDRUSH_API_KEY` server-side, calls GoldRush, computes GASS, returns JSON; the React dashboard renders it with a graceful fallback to illustrative data when no key is set. A standalone CLI (`scripts/gass.mjs`) runs the same scoring from the terminal. Timelock/quorum/guardian/turnout are v1 (governance-contract reads) — v0 ships concentration + value-at-risk + capture-cost floor from live data, which is enough to make the tweet real.

---

## 9. Who has to say yes (entity map)

| Role | Who | Why | When |
|---|---|---|---|
| **Anchor data + co-endorse partner** | **Covalent / GoldRush (Guild client)** | The data backbone *and* a co-marketing channel to their protocol customers — incentive-aligned, since Sentinel drives their consumption | **Now** |
| DEX liquidity | 0x, 1inch, Uniswap subgraph | Slippage/liquidity for a real capture-cost number | Soon |
| Simulation | Tenderly | State-fork proposal simulation — buy, don't build | Soon |
| Governance data (supplement) | Snapshot, Agora, Boardroom, DeepDAO | Proposals, votes, treasury cross-checks (Tally's gone) | Soon |
| Attribution | Arkham, Nansen, TRM | Mixer/CEX/bridge labeling for funding-trace | Later |
| Response / execution | OpenZeppelin Defender, Safe | Alerts into the customer's own multisig; never hold keys | Soon |
| Design-partner protocols | 3–5 from the Guild | On-chain Governor DAOs, $5M–$100M, spooked; paid founding rate | Now |
| Buy-side (firewalled) | 2–3 Guild funds / MMs | Diligence-feed pilots behind the disclosure firewall | Soon |
| Legal | Crypto counsel | Rating-as-opinion posture, liability caps, MNPI/manipulation review | Now |
| Credibility co-sign | PeckShield / CertiK (referral) | They do code, you do governance — complementary | Later |
| Insurance (optional) | Chainproof, Nexus Mutual, a reinsurer | Underwriting needs a track record + risk-holder; a v3 north star | Later |
| Key hires | 1 on-chain data/ML eng · 1 governance-security researcher | The only two roles that matter early | Soon |
| Strategic acquirer | Chainalysis/Hexagate, Hypernative, OpenZeppelin | The end-state buyer; build what they can't clone fast | Later |

---

## 10. Risks & patches (the red-team, condensed)

1. **Conflict-of-interest bomb** — protecting protocols while feeding funds who short them. → §3.6 firewall, in writing before the first fund dollar.
2. **Inverse-correlation trap** — the neediest can't pay; the payers don't need it. → Free score for the tail, paid monitoring for the professionalizing middle, paid hardening for the naked.
3. **Detection ≠ prevention** — 0-hour timelocks give no response window. → Response is an alert into their own controls; "install a timelock" is step one of the paid engagement.
4. **False positives / evasion** → lean on the standing score; funding-trace is a weak input, never the trigger.
5. **Off-chain governance** → precise ICP (§2); Snapshot+Safe is a different product.
6. **Infra cost** → largely solved by the Covalent relationship; still don't build sim or nodes.
7. **Liability** → rating = protected opinion; ToS caps; customer retains control.

---

## 11. Sequencing

1. **Ship the free public GASS score** for the top ~150 on-chain Governor DAOs on GoldRush data. Reach, credibility, inbound; seeds the rating standard. *(weeks — the live build in §8 is the start)*
2. **Convert the tweet + Guild into 3–5 paid founding audits.** Cash, proof, case studies. *(weeks)*
3. **Turn audits into monitoring subscriptions**, alerts wired into each customer's own Safe/Defender. *(months)*
4. **Formalize the Covalent co-endorsement + referral/consumption deal.** *(parallel, now)*
5. **Open the firewalled diligence feed** to Guild funds. *(months)*
6. **Decide: scale the niche or position for acquisition** — you hold the logos, the dataset, and the flywheel. *(decision point)*

---

## Sources
- DAO count/treasury/turnout/concentration, Tally shutdown (Mar 2026), Snapshot ~96% — BlockEden, "Tally's Shutdown Exposes Crypto's Uncomfortable Truth" (Apr 2026).
- Competing monitors + pricing — Defimon, "DeFi Security Monitoring Tools Compared (2026)"; Chainalysis Hexagate; Hypernative.
- GoldRush/Covalent API — goldrush.dev/docs.
- Source incident ($8.5M governance capture, Aug 23 2026) — Cryptobriefing; Crypto Times.
