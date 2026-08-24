// Vercel serverless function: GET /api/gass?dao=comp
// Reads GOLDRUSH_API_KEY from the environment (set it in Vercel project
// settings, never in the repo). Computes a live GASS v0 score and returns JSON.
// The API key never reaches the browser.

import { scoreDao } from '../src/lib/gass.js'
import { DAO_LIST } from '../src/data/daos.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  const daoId = (req.query.dao || 'comp').toString().toLowerCase()
  const apiKey = process.env.GOLDRUSH_API_KEY

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      error: 'no_key',
      message:
        'GOLDRUSH_API_KEY is not set. Add it in Vercel → Settings → Environment Variables to enable live scoring.',
      daos: DAO_LIST.map((d) => ({ id: d.id, name: d.name, ticker: d.ticker })),
    })
  }

  try {
    const result = await scoreDao(daoId, apiKey)
    return res.status(200).json({ ok: true, ...result })
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: 'scoring_failed',
      message: err.message || String(err),
      dao: daoId,
    })
  }
}
