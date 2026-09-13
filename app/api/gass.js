// Vercel serverless function: GET /api/gass?dao=comp
// Reads GOLDRUSH_API_KEY from the environment (set it in Vercel project
// settings, never in the repo). Computes a live GASS v0 score and returns JSON.
// The API key never reaches the browser.

import { scoreDao } from '../src/lib/gass.js'
import { DAO_LIST, DAOS } from '../src/data/daos.js'

// Bounded by the live registry, scoped to a warm serverless instance.
// Edge/WAF rate limits are still needed across instances.
export function createHandler(score = scoreDao, now = Date.now) {
 const cache = new Map()
 const pending = new Map()
 return async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }
  const rawId = req.query?.dao ?? 'comp'
  if (typeof rawId !== 'string' || !/^[a-z]{1,24}$/i.test(rawId) ||
      Object.keys(req.query || {}).some((key) => key !== 'dao')) {
    return res.status(400).json({ ok: false, error: 'invalid_query' })
  }
  const daoId = rawId.toLowerCase()
  if (!Object.hasOwn(DAOS, daoId)) return res.status(404).json({ ok: false, error: 'unknown_dao', message: 'Unknown DAO.' })
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
    let entry = cache.get(daoId)
    if (!entry || now() - entry.at >= 300_000) {
      let work = pending.get(daoId)
      if (!work) {
        work = Promise.resolve().then(() => score(daoId, apiKey)).then((result) => {
          const fresh = { result, at: now() }
          cache.set(daoId, fresh)
          return fresh
        }).finally(() => pending.delete(daoId))
        pending.set(daoId, work)
      }
      entry = await work
    }
    const result = entry.result
    // Cache only successful scores at the edge; never cache errors.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ ok: true, ...result })
  } catch {
    // Log detail server-side; return a generic message to the client.
    console.error('gass scoring failed for', daoId)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(502).json({
      ok: false,
      error: 'scoring_failed',
      message: 'Live scoring is temporarily unavailable. Please try again in a moment.',
      dao: daoId,
    })
  }
}

}
export default createHandler()
