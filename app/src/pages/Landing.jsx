import Gauge from '../components/Gauge'
import LiveScore from '../components/LiveScore'
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

export default function Landing() {
  return (
    <main className="landing">
      <section className="l-section hero">
        <div className="eyebrow">Governance risk ratings · powered by Covalent</div>
        <h1>
          Audited code. Zero exploits.
          <br />
          <span className="hl">$8.5M gone by 11:12 AM.</span>
        </h1>
        <p className="lede">
          On August 23, an attacker bought a DAO's treasury with 2 ETH out of Tornado Cash, voted himself the funds,
          and walked away with $8.5M — without breaking a single line of the protocol's audited code. Audits don't
          measure this. <b>Quorum Sentinel does</b>: a read-only rating that scores how cheaply a DAO's treasury
          could be voted away, scanned from live on-chain data via Covalent GoldRush. No keys, no monitoring service —
          just a score.
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
        <a href="#scan" className="cta">
          Scan a live DAO ↓
        </a>
      </section>

      <section className="l-section" id="problem">
        <div className="eyebrow">01 — The attack</div>
        <h2 className="section-title">There's no auditor for governance</h2>
        <p className="section-sub">
          The protocol's contracts were audited, unexploited, and functioning exactly as written. The attacker
          didn't need a bug — he needed a majority. Here's the sequence, reconstructed from PeckShield and CertiK's
          on-chain confirmation. The protocol isn't named on purpose: it keeps happening across the industry, and the
          pattern is the point, not any one team.
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

      <section className="l-section" id="score">
        <div className="eyebrow">02 — The score</div>
        <h2 className="section-title">The Governance Attack Surface Score</h2>
        <p className="section-sub">
          GASS is a 0–100 <b>rating</b> of how cheaply someone could legally buy control of a DAO's treasury right
          now — an independent read on exposure, computed from public on-chain data. A rating, not a guarantee; a
          score, not a service.
        </p>

        <div className="gass-wrap">
          <Gauge score={82} label="GASS — hours before breach" />
          <div className="gass-desc">
            <p>
              The protocol above would have scored in the low 80s the morning it was drained. A high GASS isn't a
              prediction — it's a measurement of exposure that already existed, sitting in plain sight, before anyone
              tried to exploit it.
            </p>
            <p>
              It's assembled from token-holder distribution, treasury value at risk, and how cheaply quorum-passing
              voting power can be acquired — all read from the chain.
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
      </section>

      <section className="l-section" id="scan">
        <div className="eyebrow">03 — Scan it live</div>
        <h2 className="section-title">Score a real DAO, right now</h2>
        <p className="section-sub">
          Pick a DAO. Every number below is computed live from Covalent GoldRush — no mock data.
        </p>
        <LiveScore />
      </section>

      <section className="l-section" id="about">
        <p className="section-sub" style={{ marginBottom: 0 }}>
          Read-only by design — no keys held, no funds touched, no monitoring service to buy. Quorum Sentinel is a
          rating on public on-chain data, powered by Covalent GoldRush. It is an independent opinion, not a guarantee.
        </p>
      </section>
    </main>
  )
}
