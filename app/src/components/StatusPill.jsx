export default function StatusPill({ status, children }) {
  return (
    <span className={`status-pill ${status}`}>
      <span className="dot" />
      {children}
    </span>
  )
}
