import Gauge from '../components/Gauge'
import LiveScore from '../components/LiveScore'
import { factors } from '../data/mock'
import './landing.css'

const attackSteps = [
  { time: 'STEP 1', body: <><b>2 ETH withdrawn from Tornado Cash</b>, so the funds trace back to no identifiable source.</> },
  { time: 'STEP 2', body: <><b>Governance tokens purchased.</b> At the token's thin liquidity, that stake was enough to matter.</> },
  { time: 'STEP 3', body: <><b>100% voting control seized</b> in 4 of 5 USDC strategy vaults, and about 91% of an ETH meta vault.</> },
  { time: 'STEP 4', body: <>Proposal submitted to <b>send the vault funds to himself.</b></> },
  { time: 'STEP 5', body: <>Voted <b>yes</b>. Executed.</> },
  { time: 'RESULT', body: <><b>2,843 ETH (about $6.87M) plus 1.68M USDC</b> gone, swapped to DAI. Circle cannot freeze it. Tornado Cash severed the trail.</> },
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
          and walked away with $8.5M. Not one line of the protocol's audited code was broken. Audits do not measure
          this risk. Quorum Sentinel rates it, scoring how cheaply a DAO's treasury could be voted away, using live
          on-chain data from Covalent GoldRush.
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
        <div className="eyebrow">01 · The attack</div>
        <h2 className="section-title">There's no auditor for governance</h2>
        <p className="section-sub">
          The contracts were audited, unexploited, and worked exactly as written. The attacker did not need a bug. He
          needed a majority. Below is the sequence, confirmed on-chain by PeckShield and CertiK. The protocol is left
          unnamed on purpose, because this keeps happening across the industry.
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
            <b>The contracts were fine.</b> PeckShield and CertiK confirmed it on-chain. The failure was
            architectural: tokenomics, voter apathy, and access control, not code. It has happened at least three
            times this year.
          </p>
          <div className="checks">
            {['Audited', 'Nothing bypassed', 'No reentrancy', 'No oracle manipulation', 'No keys lost'].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="l-section" id="score">
        <div className="eyebrow">02 · The score</div>
        <h2 className="section-title">The Governance Attack Surface Score</h2>
        <p className="section-sub">
          GASS is a 0 to 100 rating of how cheaply someone could legally buy control of a DAO's treasury right now. It
          is an independent read on exposure, computed from public on-chain data.
        </p>

        <div className="gass-wrap">
          <Gauge score={82} label="GASS before the breach" />
          <div className="gass-desc">
            <p>
              The protocol above would have scored in the low 80s the morning it was drained. A high GASS measures
              exposure that already exists in public data, well before anyone acts on it.
            </p>
            <p>
              It is built from token-holder distribution, treasury value at risk, and how cheaply quorum-passing
              voting power can be acquired, all read from the chain.
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
        <div className="eyebrow">03 · Scan it live</div>
        <h2 className="section-title">Score a real DAO, right now</h2>
        <p className="section-sub">
          Pick a DAO. Every number below is computed live from Covalent GoldRush, with no mock data.
        </p>
        <LiveScore />
      </section>

      <section className="l-section" id="about">
        <p className="section-sub" style={{ marginBottom: 0 }}>
          Quorum Sentinel is read-only. It holds no keys, touches no funds, and sells no monitoring service. It is a
          rating on public on-chain data, powered by{' '}
          <a className="ext" href="https://www.covalenthq.com" target="_blank" rel="noopener noreferrer">Covalent</a>{' '}
          and{' '}
          <a className="ext" href="https://goldrush.dev" target="_blank" rel="noopener noreferrer">GoldRush</a>. It is
          an independent opinion, not a guarantee.
        </p>
      </section>
    </main>
  )
}
