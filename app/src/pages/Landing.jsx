import { Link } from 'react-router-dom'
import Gauge from '../components/Gauge'
import { factors } from '../data/mock'
import './landing.css'

const attackSteps = [
  { time: 'STEP 1', body: <><b>2 ETH withdrawn from Tornado Cash</b> — funds delinked from any identifiable source.</> },
  { time: 'STEP 2', body: <><b>Governance tokens purchased</b> — enough, at prevailing thin liquidity, to matter.</> },
  { time: 'STEP 3', body: <><b>100% voting control seized</b> in 4 of 5 USDC strategy vaults, and <b>~91%</b> of an ETH meta vault.</> },
  { time: 'STEP 4', body: <>Proposal submitted: <b>send the vault funds to himself.</b></> },
  { time: 'STEP 5', body: <>Voted <b>yes</b>. Executed.</> },
  { time: 'RESULT', body: <><b>2,843 ETH (~$6.87M) + 1.68M USDC</b> gone, swapped to DAI. Circle can't freeze it. Tornado Cash severed the trail.</> },
]

const features = [
  { h: 'Wallet & delegation monitoring', p: 'Flags fresh or mixer-funded wallets accelerating toward a quorum-passing stake, and sybil-shaped delegation clusters.' },
  { h: 'Proposal simulation', p: "Forks state the moment a proposal lands. Shows what it actually does, and who's voting yes, before the timelock even starts." },
  { h: 'Guardian Response Network', p: 'On-call responders who can trigger a configured veto or pause inside the timelock window — incident response, for votes.' },
  { h: 'Governance red-team', p: 'A paid hardening engagement for tokenomics, quorum, timelock, and guardian design — the audit category nobody sells yet.' },
  { h: 'Risk signal feed', p: 'Governance-capture-in-progress as a data product for funds — material information, priced for people who trade on it.' },
]

const buyers = [
  { who: 'Pays for protection', h: 'DAOs & DeFi protocols', p: 'Subscription monitoring plus a paid governance hardening engagement. No free tier.' },
  { who: 'Pays for underwriting', h: 'Insurers & treasury desks', p: 'License the scoring engine to price "governance capture" as a covered peril. Revenue share on every premium written.' },
  { who: 'Pays for signal', h: 'Funds & market makers', p: 'Pay for the raw risk feed as an early, tradeable signal — independent of caring who runs the DAO.' },
]

const pricing = [
  { tier: 'Starter', price: '$999/mo · per protocol', forr: 'GASS score + basic threshold alerts' },
  { tier: 'Pro', price: '$4,999/mo · per protocol', forr: 'Full wallet monitoring, proposal simulation, response SLA' },
  { tier: 'Enterprise', price: 'Custom', forr: 'Multi-protocol treasury desks, dedicated response, white-label' },
  { tier: 'Red-Team Audit', price: '$25K–$150K one-time', forr: 'Full tokenomics / quorum / timelock hardening' },
  { tier: 'Risk Signal API', price: '$2K–$10K/mo', forr: 'Real-time governance-risk feed for funds' },
]

const economics = [
  { n: '01', h: 'Zero acquisition cost', p: "This launches straight to a network that's already the exact buyer list — protocols, treasury desks, funds, market makers. No ad spend, no cold outreach." },
  { n: '02', h: 'No free tier', p: "Design partners get a paid pilot audit at a founding-member rate, credited against year one if they subscribe. Not free — discounted, and only for the first movers." },
  { n: '03', h: 'Three revenue lines, one build', p: 'Protocol subscriptions, red-team audits, and the fund-side signal feed all run off the same scoring engine. One codebase, three invoices.' },
  { n: '04', h: 'A Guild-exclusive window', p: 'The signal feed goes to Guild fund members first, at a premium, before any public release. Early access is the product, not a perk.' },
]

export default function Landing() {
  return (
    <main className="landing">
      <section className="l-section hero">
        <div className="eyebrow">Governance-attack monitoring</div>
        <h1>
          Audited code. Zero exploits.
          <br />
          <span className="hl">$8.5M gone by 11:12 AM.</span>
        </h1>
        <p className="lede">
          On August 23, an attacker bought a DAO's treasury with 2 ETH out of Tornado Cash, voted himself the funds,
          and walked away with $8.5M — without breaking a single line of the protocol's audited code. This is the
          third time this year the pattern has played out. Nobody sells the thing that would have stopped it. I'm
          building it, and launching it through this network first.
        </p>
        <div className="stat-row">
          <div className="stat">
            <div className="num mono">2 ETH</div>
            <div className="lbl">Attacker's seed capital</div>
          </div>
          <div className="stat">
            <div className="num mono danger">100%</div>
            <div className="lbl">Voting control, 4 of 5 vaults</div>
          </div>
          <div className="stat">
            <div className="num mono danger">$8.5M</div>
            <div className="lbl">Drained, one proposal, one vote</div>
          </div>
        </div>
        <Link to="/dashboard" className="cta">
          See the live demo dashboard →
        </Link>
      </section>

      <section className="l-section" id="problem">
        <div className="eyebrow">01 — The Attack</div>
        <h2 className="section-title">There's no auditor for governance</h2>
        <p className="section-sub">
          The protocol's contracts were audited, unexploited, and functioning exactly as written. The attacker
          didn't need a bug — he needed a majority. Here's the sequence, reconstructed from PeckShield and CertiK's
          on-chain confirmation. The protocol isn't named here on purpose: this keeps happening across the industry,
          and the pattern is the point, not any one team's embarrassment.
        </p>

        <div className="timeline">
          {attackSteps.map((s, i) => (
            <div className="tl-item hit" key={i}>
              <span className="tl-time mono">{s.time}</span>
              <div className="tl-body">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="callout">
          <p>
            <b>The contracts were fine.</b> PeckShield and CertiK confirmed it on-chain — this was architectural:
            tokenomics, voter apathy, and access control, not code. It's happened at least three times this year.
          </p>
          <div className="checks">
            {['Audited', 'Nothing bypassed', 'No reentrancy', 'No oracle manipulation', 'No keys lost'].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section" id="product">
        <div className="eyebrow">02 — The Fix</div>
        <h2 className="section-title">Quorum Sentinel watches the vote, not just the code</h2>
        <p className="section-sub">
          A monitoring and response layer for governance-capture risk — the gap between what CertiK and Forta
          already cover (contracts, oracles, liquidations) and the thing that actually took this protocol down.
        </p>

        <div className="gass-wrap">
          <Gauge score={82} label="GASS — hours before breach" />
          <div className="gass-desc">
            <p>
              <b>The Governance Attack Surface Score</b> is a 0–100 read on how cheap it would be, right now, for
              someone to legally buy control of a protocol's treasury — recomputed continuously as token
              distribution, delegation, and liquidity shift.
            </p>
            <p>
              This protocol would have scored in the low 80s the morning of the attack. High GASS isn't a
              prediction — it's a measurement of exposure that existed before anyone tried to exploit it.
            </p>
          </div>
        </div>

        <div className="factor-grid">
          {factors.map((f) => (
            <div className="factor" key={f.key}>
              <div className="k mono">{f.key}</div>
              <div className="v">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature" key={f.h}>
              <div className="idx mono">FEATURE</div>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section" id="model">
        <div className="eyebrow">03 — The Model</div>
        <h2 className="section-title">Three buyers, one engine</h2>
        <p className="section-sub">
          The same scoring and monitoring pipeline sells three ways — and this network already contains all three,
          which is exactly why it launches here first.
        </p>

        <div className="buyer-grid">
          {buyers.map((b) => (
            <div className="buyer" key={b.h}>
              <div className="who mono">{b.who}</div>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <table className="pricing">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Price</th>
                <th>For</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((row) => (
                <tr key={row.tier}>
                  <td className="tier">{row.tier}</td>
                  <td className="price mono">{row.price}</td>
                  <td className="for">{row.forr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="l-section" id="economics">
        <div className="eyebrow">04 — The Economics</div>
        <h2 className="section-title">Why this pays, not just why it's useful</h2>
        <p className="section-sub">
          This isn't a community good-will project. It's a for-profit venture that happens to launch from inside a
          network built to be its first customers on both sides of the trade.
        </p>

        <div className="ask-list">
          {economics.map((a) => (
            <div className="ask" key={a.n}>
              <div className="n mono">{a.n}</div>
              <div>
                <h3>{a.h}</h3>
                <p>{a.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section" id="contact">
        <div className="eyebrow">05 — Get In</div>
        <h2 className="section-title">DM me</h2>
        <p className="section-sub">
          Running a protocol with active governance and a treasury worth defending? Trading DeFi tokens and want the
          signal feed early? Want to help build this? Reach out directly — first movers get the founding-member
          rate, not a free ride.
        </p>
      </section>
    </main>
  )
}
