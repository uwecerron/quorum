import { useState } from 'react'
import Gauge from './Gauge'
import { DAO_LIST } from '../data/daos'
import './livescore.css'

function usd(n) {
  if (n == null) return 'n/a'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n}`
}

export default function LiveScore() {
  const [daoId, setDaoId] = useState('comp')
  const [state, setState] = useState({ status: 'idle' })

  async function run(id) {
    setDaoId(id)
    setState({ status: 'loading' })
    try {
      const res = await fetch(`/api/gass?dao=${id}`)
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        // No serverless function responding (e.g. static preview without a backend).
        setState({
          status: 'error',
          code: 'no_backend',
          error: 'The /api/gass function isn\'t responding here — deploy to Vercel (or run `vercel dev`) with a GoldRush key set.',
        })
        return
      }
      const json = await res.json()
      if (!json.ok) {
        setState({ status: 'error', error: json.message || 'Scoring unavailable', code: json.error })
        return
      }
      setState({ status: 'done', data: json })
    } catch (err) {
      setState({ status: 'error', error: err.message, code: 'network' })
    }
  }

  const d = state.status === 'done' ? state.data : null

  return (
    <section className="livescore">
      <div className="ls-head">
        <div>
          <div className="ls-eyebrow mono">Live · Covalent GoldRush</div>
          <h2>Score a real DAO from on-chain data</h2>
          <p>
            This pulls live token-holder distribution and treasury balances from GoldRush and computes a GASS v0 on
            the spot — no mock data. Big, deep-float DAOs should score <b>low</b> (they're hard to capture); that's
            the model telling the truth.
          </p>
        </div>
      </div>

      <div className="ls-picker">
        {DAO_LIST.map((dao) => (
          <button
            key={dao.id}
            className={`ls-chip ${daoId === dao.id ? 'active' : ''}`}
            onClick={() => run(dao.id)}
          >
            {dao.name} <span className="mono">{dao.ticker}</span>
          </button>
        ))}
      </div>

      {state.status === 'idle' && (
        <div className="ls-hint mono">Pick a DAO to compute a live score.</div>
      )}

      {state.status === 'loading' && (
        <div className="ls-hint mono">Querying GoldRush + computing GASS…</div>
      )}

      {state.status === 'error' && (
        <div className="ls-error">
          <div className="ls-error-title mono">
            {state.code === 'no_key'
              ? 'Live mode needs a GoldRush key'
              : state.code === 'no_backend'
                ? 'Backend not running here'
                : 'Live scoring unavailable'}
          </div>
          <p>{state.error}</p>
          <p className="ls-error-sub">
            The rest of the demo runs on illustrative data. Set <span className="mono">GOLDRUSH_API_KEY</span> in
            Vercel → Settings → Environment Variables to light this panel up.
          </p>
        </div>
      )}

      {d && (
        <div className="ls-result">
          <div className="ls-gauge">
            <Gauge score={d.gass} label={`GASS · ${d.dao.ticker}`} size={190} />
          </div>
          <div className="ls-breakdown">
            <div className="ls-components">
              <Component label="Affordability" value={d.components.affordability} hint="capture-cost floor vs. treasury" />
              <Component label="Concentration" value={d.components.concentration} hint={`top-10 hold ${d.detail.top10Share}% of supply`} />
              <Component label="Ease of quorum" value={d.components.easeOfQuorum} hint={`quorum = ${d.detail.quorumShareOfSupply}% of supply`} />
            </div>
            <div className="ls-metrics">
              <Metric k="Treasury at risk" v={usd(d.detail.valueAtRiskUSD)} />
              <Metric k="Capture-cost floor" v={usd(d.detail.captureCostFloorUSD)} />
              <Metric k="Spot price" v={d.detail.spotUSD != null ? `$${d.detail.spotUSD}` : 'n/a'} />
              <Metric k="Holders sampled" v={d.detail.holdersSampled} />
            </div>
            <p className="ls-note mono">{d.computedNote}</p>
          </div>
        </div>
      )}
    </section>
  )
}

function Component({ label, value, hint }) {
  const color = value >= 66 ? 'var(--danger)' : value >= 33 ? 'var(--warn)' : 'var(--accent)'
  return (
    <div className="ls-comp">
      <div className="ls-comp-top">
        <span className="ls-comp-label">{label}</span>
        <span className="ls-comp-val mono" style={{ color }}>{value}</span>
      </div>
      <div className="ls-bar">
        <div className="ls-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <div className="ls-comp-hint">{hint}</div>
    </div>
  )
}

function Metric({ k, v }) {
  return (
    <div className="ls-metric">
      <div className="ls-metric-k mono">{k}</div>
      <div className="ls-metric-v mono">{v}</div>
    </div>
  )
}
