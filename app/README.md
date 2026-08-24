# Quorum Sentinel

Governance attack surface monitoring for DAOs and DeFi treasuries — a for-profit product launching through Traders Guild, built around a real $8.5M governance-capture incident (Aug 23, 2026). The protocol that was hit is deliberately not named anywhere in this product — the recurring pattern is the pitch, not any one team's bad week.

Two pages:

- **`/`** — the pitch: the incident case study (anonymized), the product (Governance Attack Surface Score, wallet monitoring, proposal simulation, guardian response network), the monetization model, and the founder economics of launching through an owned network + the Covalent flywheel.
- **`/dashboard`** — the demo console. The protocol portfolio and the "Incident 003" replay are illustrative; the **Live Score panel is real** — it computes a GASS v0 for actual Governor DAOs (Compound, Uniswap, ENS) from **Covalent GoldRush** data on demand.

See `../SPEC.md` for the full written spec, and the **Sentinel Red Team** teardown for the strategy analysis.

## Stack

React 19 + Vite + React Router, plus a Vercel serverless function (`/api/gass`) that calls GoldRush server-side. The frontend is static; the only backend is that one function.

## Live GASS scoring (Covalent GoldRush)

The live panel needs a GoldRush API key. **The key stays server-side** — it's read from `GOLDRUSH_API_KEY` by the serverless function and the CLI, and never reaches the browser.

Get a free key at [goldrush.dev](https://goldrush.dev) (keys start with `cqt_`).

**Run the scorer from the terminal (fastest way to see real numbers):**

```bash
npm install
GOLDRUSH_API_KEY=cqt_your_key node scripts/gass.mjs comp
GOLDRUSH_API_KEY=cqt_your_key node scripts/gass.mjs comp uni ens
# or: GOLDRUSH_API_KEY=cqt_your_key npm run score -- comp
```

**In the deployed app:** set `GOLDRUSH_API_KEY` in Vercel → Settings → Environment Variables, then the Live Score panel on `/dashboard` works. Without a key, the panel shows a clear "live mode needs a key" message and the rest of the demo still runs on illustrative data.

### What GASS v0 computes (honestly)

From live GoldRush data: **concentration** (top-holder share + HHI via `token_holders_v2`), **value at risk** (treasury balances via `balances_v2`), and a **capture-cost floor** (spot price × quorum tokens — ignores DEX slippage, so it's a floor, clearly labeled). Timelock depth, guardian coverage, and turnout are v1 (governance-contract reads) and are not in v0. Deep-float DAOs like Uniswap should score **low** — that's the model being honest, and it's the whole "the capturable ones are the small ones" thesis, shown with real numbers.

Add a real capture-cost (not just a floor) by wiring a DEX liquidity source (0x / 1inch / Uniswap subgraph) into `api/_gass.js`.

## Run locally

```bash
npm install
npm run dev          # frontend only; the /api function runs on Vercel (or `vercel dev`)
```

To exercise the `/api/gass` function locally, use `vercel dev` (needs the Vercel CLI and the env var).

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel                       # Vite auto-detected; the api/ folder deploys as functions
vercel env add GOLDRUSH_API_KEY   # paste your cqt_ key when prompted
vercel --prod
```

Or via Git: **New Project → Import** the repo, add `GOLDRUSH_API_KEY` in project settings. `vercel.json` rewrites everything except `/api/*` to `index.html` so client-side routing works.

## Project structure

```
api/
  gass.js       Serverless function: GET /api/gass?dao=comp  (reads GOLDRUSH_API_KEY)
  _gass.js      Shared GASS scoring + GoldRush fetch helpers (not an endpoint)
scripts/
  gass.mjs      CLI: GOLDRUSH_API_KEY=… node scripts/gass.mjs comp
src/
  components/   Gauge, StatusPill, AlertFeed, ReplayTimeline, LiveScore, NavBar, Footer
  data/
    mock.js     Illustrative portfolio + Incident 003 replay + alert feed
    daos.js     Real Governor DAO registry (token/treasury/governor addresses)
  pages/        Landing.jsx (pitch) and Dashboard.jsx (console)
  styles/       Global design tokens (light + dark, prefers-color-scheme aware)
```
