export default function AlertFeed({ alerts }) {
  return (
    <div className="alert-feed">
      {alerts.map((a) => (
        <div className="alert-row enter" key={a.id}>
          <span className={`lvl ${a.level}`} />
          <div className="body">
            <div className="top">
              <span className="proto mono">{a.protocol}</span>
              <span className="age mono">{a.age}</span>
            </div>
            <div className="msg">{a.msg}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
