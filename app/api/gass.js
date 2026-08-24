// Vercel serverless function: GET /api/gass?dao=comp
// Reads GOLDRUSH_API_KEY from the environment (set it in Vercel project
// settings, never in the repo). Computes a live GASS v0 score and returns JSON.
// The API key never reaches the browser.

import { scoreDao } from '../src/lib/gass.js'
import { DAO_LIST } from '../src/data/daos.js'

export default async function handler(req, res) {
  const daoId = (req.query.dao || 'comp').toString().toLowerCase()
  const apiKey = process.env.GOLDRUSH_API_KEY

  if (!apiKey) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(503).json({
      ok: false,
      error: 'no_key',
      message:
        'GOLDRUSH_API_KEY is not set. Add it in Vercel Settings, Environment Variables, to enable live scoring.',
      daos: DAO_LIST.map((d) => ({ id: d.id, name: d.name, ticker: d.ticker })),
    })
  }

  try {
    const result = await scoreDao(daoId, apiKey)
    // Cache only successful scores at the edge; never cache errors.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ ok: true, ...result })
  } catch (err) {
    // Log detail server-side; return a generic message to the client.
    console.error('gass scoring failed for', daoId, err && err.message)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(502).json({
      ok: false,
      error: 'scoring_failed',
      message: 'Live scoring is temporarily unavailable. Please try again in a moment.',
      dao: daoId,
    })
  }
}
