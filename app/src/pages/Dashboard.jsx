import { useEffect, useState } from 'react'
import Gauge from '../components/Gauge'
import StatusPill from '../components/StatusPill'
import AlertFeed from '../components/AlertFeed'
import ReplayTimeline from '../components/ReplayTimeline'
import LiveScore from '../components/LiveScore'
import { protocols, alertFeedSeed, formatUsd } from '../data/mock'
import './dashboard.css'

const LIVE_ALERTS = [
  { protocol: 'Harbor DAO', level: 'warn', msg: 'Wallet 0x7fA2…c91d now holds 44% of quorum-passing stake (+3% in 20m).' },
  { protocol: 'Meridian Credit', level: 'info', msg: 'Delegate churn detected: 3 large holders re-delegated within one block.' },
  { protocol: 'Harbor DAO', level: 'critical', msg: 'Simulated proposal draft touches vault withdrawal permissions.' },
  { protocol: 'Vellum Protocol', level: 'info', msg: 'Weekly GASS recompute: score unchanged at 33.' },
]

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState('incident-003')
  const [alerts, setAlerts] = useState(alertFeedSeed)
  const selected = protocols.find((p) => p.id === selectedId)

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      const next = LIVE_ALERTS[i % LIVE_ALERTS.length]
      setAlerts((prev) => [{ id: Date.now(), age: 'just now', ...next }, ...prev].slice(0, 8))
      i += 1
    }, 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <main className="dashboard">
      <div className="container dash-head">
        <div className="eyebrow">Live demo · sample portfolio</div>
        <h1>Risk console</h1>
        <p className="dash-sub">
          The portfolio below is illustrative. The panel underneath it is <b>live</b>, scoring real Governor DAOs
          from Covalent GoldRush data on demand. Incident 003 carries a real attack's timeline, with the protocol
          name withheld on purpose.
        </p>
      </div>

      <div className="container">
        <LiveScore />
      </div>

      <div className="container dash-grid">
        <div className="protocol-list">
          <div className="list-head mono">MONITORED PROTOCOLS</div>
          {protocols.map((p) => (
            <button
              key={p.id}
              className={`protocol-row ${p.id === selectedId ? 'selected' : ''}`}
              onClick={() => setSelectedId(p.id)}
            >
              <div className="pr-top">
                <span className="pr-name">{p.name}</span>
                <span className="pr-gass mono" style={{ color: p.gass >= 70 ? 'var(--danger)' : p.gass >= 45 ? 'var(--warn)' : 'var(--accent)' }}>
                  {p.gass}
                </span>
              </div>
              <div className="pr-bottom">
                <StatusPill status={p.status}>{p.statusLabel}</StatusPill>
                <span className="pr-treasury mono">{formatUsd(p.treasury)}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="protocol-detail">
          {selected && (
            <>
              <div className="detail-top">
                <div>
                  <div className="detail-eyebrow mono">{selected.ticker}</div>
                  <h2>{selected.name}</h2>
                  <StatusPill status={selected.status}>{selected.statusLabel}</StatusPill>
                </div>
                <Gauge score={selected.gass} label="GASS" size={160} />
              </div>

              <p className="detail-note">{selected.note}</p>

              <div className="metric-row">
                <div className="metric">
                  <div className="metric-l mono">Treasury at risk</div>
                  <div className="metric-v mono">{formatUsd(selected.treasury)}</div>
                </div>
                <div className="metric">
                  <div className="metric-l mono">Turnout (avg)</div>
                  <div className="metric-v mono">{selected.turnout}%</div>
                </div>
                <div className="metric">
                  <div className="metric-l mono">Timelock</div>
                  <div className="metric-v mono">{selected.timelockHrs}h</div>
                </div>
              </div>
              <div className="metric-wide">
                <span className="metric-l mono">Guardian coverage</span>
                <span className="metric-v mono">{selected.guardian}</span>
              </div>

              {selected.id === 'incident-003' && <ReplayTimeline />}
            </>
          )}
        </div>

        <div className="alert-panel">
          <div className="list-head mono">ALERT FEED</div>
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </main>
  )
}
