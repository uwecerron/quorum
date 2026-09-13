import { useRef, useState } from 'react'
import Gauge from './Gauge'
import { LIVE_DAO_LIST } from '../data/daos'
import './livescore.css'

function usd(n) {
  if (n == null) return 'n/a'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n)}`
}

function price(n) {
  if (n == null) return 'n/a'
  return `$${Number(n).toLocaleString(undefined, { maximumSignificantDigits: 4 })}`
}

export default function LiveScore() {
  const [daoId, setDaoId] = useState('forth')
  const [state, setState] = useState({ status: 'idle' })
  const reqId = useRef(0)
  const [query, setQuery] = useState('')

  async function run(id) {
    const myId = ++reqId.current
    setDaoId(id)
    setState({ status: 'loading' })
    try {
      const res = await fetch(`/api/gass?dao=${id}`)
      const ct = res.headers.get('content-type') || ''
      if (myId !== reqId.current) return // a newer request superseded this one
      if (!ct.includes('application/json')) {
        setState({
          status: 'error',
          code: 'no_backend',
          error: 'The /api/gass function is not responding here. Deploy to Vercel, or run vercel dev, with a GoldRush key set.',
        })
        return
      }
      const json = await res.json()
      if (myId !== reqId.current) return
      if (!json.ok) {
        setState({ status: 'error', error: json.message || 'Scoring unavailable', code: json.error })
        return
      }
      setState({ status: 'done', data: json })
    } catch (err) {
      if (myId !== reqId.current) return
      setState({ status: 'error', error: err.message, code: 'network' })
    }
  }

  const d = state.status === 'done' ? state.data : null

  return (
    <section className="livescore">
      <div className="ls-head">
        <div>
          <div className="ls-eyebrow mono">Live · GoldRush by Covalent</div>
          <h2>Score a real DAO from on-chain data</h2>
          <p>
            This reads live token-holder distribution and treasury balances from GoldRush by Covalent and computes a
            GASS where live quorum and token pricing support it. Governance, NFT and multisig models show their own metrics. Treasury balances cover the named accounts only.
          </p>
        </div>
      </div>

      <label className="ls-search">Find a protocol
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ampleforth, Gitcoin, Radworks…" />
      </label>
      <p className="ls-note">{LIVE_DAO_LIST.length} protocols connected to live data</p>
      <div className="ls-picker">
        {LIVE_DAO_LIST.filter((dao) => `${dao.name} ${dao.ticker}`.toLowerCase().includes(query.toLowerCase())).map((dao) => (
          <button
            key={dao.id}
            className={`ls-chip ${daoId === dao.id ? 'active' : ''}`}
            aria-pressed={daoId === dao.id}
            onClick={() => run(dao.id)}
          >
            {dao.name} <span className="mono">{dao.ticker}</span>
          </button>
        ))}
      </div>

      {state.status === 'idle' && (
        <div className="ls-hint mono">Pick a protocol to fetch live holders, treasury balances and governance metrics.</div>
      )}

      {state.status === 'loading' && (
        <div className="ls-hint mono">Fetching GoldRush data and reading governance contracts…</div>
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
          {state.code === 'no_key' && <p className="ls-error-sub">
            Set <span className="mono">GOLDRUSH_API_KEY</span> in your Vercel project settings to enable live scoring.
          </p>}
        </div>
      )}

      {d && (
        <div className="ls-result">
          <div className="ls-gauge">
            {d.gass != null ? <Gauge score={d.gass} label={`GASS · ${d.dao.ticker}`} size={190} /> : <div><h3>{d.dao.name}</h3><p>GASS unavailable</p><p className="ls-note">{d.scoreUnavailableReason}</p></div>}
          </div>
          <div className="ls-breakdown">
            {d.components && <div className="ls-components">
              <Component label="Affordability" value={d.components.affordability} hint="spot price × live quorum" />
              <Component label="Concentration" value={d.components.concentration} hint={`top 10 hold ${d.detail.top10Share}% of supply`} />
              <Component label="Ease of quorum" value={d.components.easeOfQuorum} hint={`quorum is ${d.detail.quorumShareOfSupply}% of supply`} />
            </div>}
            <div className="ls-metrics">
              <Metric k="Treasury total" v={usd(d.detail.treasuryTotalUSD)} />
              <Metric k="Quorum-cost estimate" v={usd(d.detail.captureCostFloorUSD)} />
              <Metric k="Spot price" v={price(d.detail.spotUSD)} />
              <Metric k="Holders sampled" v={d.detail.holdersSampled ?? 'Unavailable'} />
              <Metric k="Top-10 share of supply" v={d.detail.top10Share == null ? 'Unavailable' : `${d.detail.top10Share}%`} />
              <Metric k="Live quorum / minimum votes" v={d.detail.quorumTokens?.toLocaleString() ?? 'Not available for this model'} />
              <Metric k="Timelock delay" v={d.governance.delaySeconds == null ? 'Not available' : `${d.governance.delaySeconds / 3600} hours`} />
              {d.governance.signerThreshold != null && <Metric k="Treasury Safe signers" v={`${d.governance.signerThreshold} of ${d.governance.signerCount ?? '?'}`} />}
            </div>
            <p className="ls-note">{d.computedNote}</p>
            <p className="ls-note">Fetched {new Date(d.fetchedAt).toLocaleString()}{d.governance.blockNumber ? ` · Governance block ${d.governance.blockNumber}` : ''}</p>
            <p><a href={d.dao.source} target="_blank" rel="noopener noreferrer">Protocol source</a> · <a href={`https://etherscan.io/token/${d.dao.token}`} target="_blank" rel="noopener noreferrer">Token contract</a>{d.governance.governor && <> · <a href={`https://etherscan.io/address/${d.governance.governor}`} target="_blank" rel="noopener noreferrer">Governor</a></>}</p>
            {d.warnings.map((warning) => <p className="ls-note" key={warning}>{warning}</p>)}
            {d.treasury.accounts.map((account) => <details className="ls-account" key={account.address}>
              <summary>{account.label}: {account.status === 'live' ? usd(account.totalUSD) : 'Unavailable'}</summary>
              <a href={`https://etherscan.io/address/${account.address}`} target="_blank" rel="noopener noreferrer">{account.address}</a>
              <p><a href={account.source || d.dao.source} target="_blank" rel="noopener noreferrer">Account source</a></p>
              <p className="ls-note">{account.updatedAt ? `GoldRush updated ${account.updatedAt}` : 'Provider update time unavailable'}</p>
              <div className="ls-table-scroll"><table><thead><tr><th>Holding</th><th>USD</th><th>Governance asset</th></tr></thead><tbody>{(account.holdings || []).map((holding, index) => <tr key={`${holding.address}-${index}`}><td>{holding.symbol}</td><td>{usd(holding.usd)}</td><td>{holding.nativeGovernanceToken ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>
            </details>)}
            {!!d.detail.topHolders.length && <details className="ls-account"><summary>Largest sampled holders</summary><div className="ls-table-scroll"><table><thead><tr><th>Address</th><th>Tokens</th><th>Supply share</th></tr></thead><tbody>{d.detail.topHolders.map((holder) => <tr key={holder.address}><td><a href={`https://etherscan.io/address/${holder.address}`} target="_blank" rel="noopener noreferrer">{holder.address.slice(0, 8)}…{holder.address.slice(-6)}</a></td><td>{holder.tokens.toLocaleString()}</td><td>{(holder.share * 100).toFixed(2)}%</td></tr>)}</tbody></table></div><p className="ls-note">Balances are not delegated voting power. Custodians and exchanges can represent many owners.</p></details>}
          </div>
        </div>
      )}
    </section>
  )
}

function Component({ label, value, hint }) {
  const color = value >= 66 ? 'var(--danger)' : value >= 33 ? 'var(--warn)' : 'var(--good)'
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
