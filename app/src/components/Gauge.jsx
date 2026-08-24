const RADIUS = 96
const CIRC = Math.PI * RADIUS // half-circle arc length

function colorFor(score) {
  if (score >= 70) return 'var(--danger)'
  if (score >= 45) return 'var(--warn)'
  return 'var(--accent)'
}

export default function Gauge({ score, label, size = 220 }) {
  const offset = CIRC - (CIRC * score) / 100
  const color = colorFor(score)
  return (
    <div className="gauge" style={{ width: size }}>
      <svg viewBox="0 0 220 130" width={size} height={(size * 130) / 220}>
        <path
          d="M 14 116 A 96 96 0 0 1 206 116"
          fill="none"
          stroke="var(--border)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 14 116 A 96 96 0 0 1 206 116"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="gauge-score">
        <div className="gauge-n mono" style={{ color }}>
          {score}
        </div>
        {label && <div className="gauge-l mono">{label}</div>}
      </div>
    </div>
  )
}
