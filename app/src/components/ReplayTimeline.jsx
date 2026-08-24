import { useEffect, useState } from 'react'
import { incidentReplay } from '../data/mock'

export default function ReplayTimeline() {
  const [revealed, setRevealed] = useState(1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (revealed >= incidentReplay.length) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setRevealed((r) => r + 1), 1100)
    return () => clearTimeout(id)
  }, [playing, revealed])

  function replay() {
    setRevealed(1)
    setPlaying(true)
  }

  return (
    <div className="replay">
      <div className="replay-toolbar">
        <div>
          <h3>Incident 003, run again with Sentinel live</h3>
          <p>Same attack, same timestamps. Left: what actually happened. Right: what fires when Sentinel is watching.</p>
        </div>
        <button className="replay-btn" onClick={replay}>
          {playing ? 'Replaying…' : '▶ Replay incident'}
        </button>
      </div>

      <div className="replay-grid">
        <div className="replay-col">
          <div className="replay-head bad">What happened</div>
          {incidentReplay.slice(0, revealed).map((s) => (
            <div className={`r-step ${s.severity === 'resolved' ? 'fatal' : ''}`} key={s.t}>
              <span className="t mono">{s.t}</span>
              <span>{s.actual}</span>
            </div>
          ))}
        </div>
        <div className="replay-col">
          <div className="replay-head good">With Sentinel</div>
          {incidentReplay.slice(0, revealed).map((s) => (
            <div className={`r-step ${s.severity !== 'info' ? 'alert' : ''}`} key={s.t}>
              <span className="t mono">{s.t}</span>
              <span>{s.sentinel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
