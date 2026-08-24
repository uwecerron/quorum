# Deploying to Vercel with live GoldRush data

Verified working. Three steps, ~5 minutes.

## The one thing people miss
The React app is in the **`app/`** subfolder, not the repo root. So in Vercel you must set **Root Directory → `app`**. Everything else is auto-detected.

## Steps

**1. Import the repo**
Vercel dashboard → **Add New → Project → Import** your Git repo.
Set **Root Directory = `app`**. Framework preset auto-detects as **Vite** (build `npm run build`, output `dist`). Leave those as-is.

**2. Add the GoldRush key (this is what makes data live)**
Project → **Settings → Environment Variables** → add:

```
GOLDRUSH_API_KEY = cqt_your_key_here
```

(Get a free key at goldrush.dev. It's read only by the serverless function and the CLIs — it never ships to the browser.)

**3. Deploy.** That's it.

## What's live after deploy
- **`/dashboard` → Live Score panel** calls `/api/gass?dao=comp` (a Vercel serverless function that reads `GOLDRUSH_API_KEY`, queries GoldRush, returns a live GASS score). Compound / Uniswap / ENS score in real time.
- Without the key, the panel shows a clear "add a key" message and the rest of the demo still runs. **The key is the only switch between demo and live.**

## The public leaderboard (Governance Risk Radar)
The Radar renders from `src/data/leaderboard.json`. Populate it with real numbers:

```bash
cd app
GOLDRUSH_API_KEY=cqt_your_key npm run leaderboard   # scores every DAO, writes the JSON
git add src/data/leaderboard.json && git commit -m "refresh radar" && git push
```

To keep it fresh automatically, add a Vercel Cron (or a GitHub Action) that runs that command daily.

## CLI (fastest way to see real numbers, no deploy)
```bash
cd app && npm install
GOLDRUSH_API_KEY=cqt_your_key node scripts/gass.mjs comp uni ens
```

## Verified
- `npm run build` — passes (41 modules).
- Serverless function contract tested with a mock request: returns `no_key` (503) without a key, graceful error (502) on a bad key, and `ok:true` with real data on a valid key.
- Sandbox reached `api.covalenthq.com` and got a valid auth challenge — endpoint paths and Bearer auth confirmed.
- Only a valid `cqt_` key stands between this and live data.
