import { useState } from 'react'
import coverage from '../data/coverage.json'
import { DAOS } from '../data/daos'
import './coverage.css'

const usd = (n) => n == null ? 'Not verified' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function DaoCoverage() {
  const [query, setQuery] = useState('')
  const protocols = coverage.protocols.filter((dao) => `${dao.name} ${dao.ticker}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="coverage" aria-labelledby="coverage-title">
    <div className="eyebrow">Onchain data powered by GoldRush by Covalent</div>
    <h2 id="coverage-title">DAO coverage</h2>
    <p>{coverage.protocols.length} DAOs tracked for research. Historical scan: {coverage.asOf}, Ethereum mainnet only. Current integrations can be queried in the live panel below.</p>
    <p>Reported liquid assets are not verified vote-reachable funds. Execution descriptions and asset classifications below come from the supplied scan and need validation. A timelock alone does not establish safety.</p>
    <label className="coverage-search">Find a DAO <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or ticker" /></label>
    <div className="coverage-grid">
      {protocols.map((dao) => <article className="coverage-card" key={dao.id}>
        <h3>{dao.name} <small>{dao.ticker}</small></h3>
        <p className="mono">{DAOS[dao.id].status === 'research' ? 'Research · live scoring pending' : 'Live integration · configured quorum'}</p>
        {DAOS[dao.id].missing && <p>To verify: {DAOS[dao.id].missing.join('; ')}.</p>}
        {DAOS[dao.id].addressSource && <a href={DAOS[dao.id].addressSource}>Official contract addresses</a>}
        {dao.screen && <p>Historical 2%-of-supply spot estimate: <b>{usd(dao.screen.spotTwoPercentEstimateUSD)}</b>. This is not the DAO’s verified quorum or acquisition cost.</p>}
        {!dao.treasuries.length && <p>Treasury holdings: not verified in this scan.</p>}
        {dao.treasuries.map((treasury) => <details key={treasury.name}>
          <summary>{treasury.name}</summary>
          <dl><dt>Reported liquid assets</dt><dd>{usd(treasury.liquidUSD)}</dd><dt>Reported treasury total</dt><dd>{usd(treasury.totalUSD)}</dd></dl>
          <p>Reported execution: {treasury.reportedExecution}. Verification pending.</p>
          <div className="coverage-table"><table><caption>Reported holdings above $1,000 · {coverage.asOf}</caption><thead><tr><th>Asset</th><th>USD</th><th>Source classification</th></tr></thead><tbody>{treasury.holdings.map((holding, index) => <tr key={`${holding.token}-${index}`}><td>{holding.token}</td><td>{usd(holding.usd)}</td><td>{holding.reportedClass}</td></tr>)}</tbody></table></div>
        </details>)}
      </article>)}
    </div>
    {!protocols.length && <p>No DAOs match your search.</p>}
  </section>
}
