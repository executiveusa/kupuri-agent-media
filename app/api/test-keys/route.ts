import { NextResponse } from 'next/server'

// Temporary endpoint to verify free-tier API keys are working in Vercel.
// Remove this file once keys are confirmed.
export const runtime = 'nodejs'

export async function GET() {
  const results: Record<string, { ok: boolean; detail: string }> = {}

  // 1. Groq
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    results.groq = { ok: false, detail: 'GROQ_API_KEY not set' }
  } else {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'Say "ok" in one word.' }],
          max_tokens: 5,
        }),
      })
      results.groq = r.ok
        ? { ok: true, detail: `HTTP ${r.status}` }
        : { ok: false, detail: `HTTP ${r.status}: ${await r.text().then(t => t.slice(0, 100))}` }
    } catch (e) {
      results.groq = { ok: false, detail: String(e) }
    }
  }

  // 2. HuggingFace (FLUX.1-schnell — cheapest check: 1-step, 64×64)
  const hfToken = process.env.HF_TOKEN
  if (!hfToken) {
    results.huggingface = { ok: false, detail: 'HF_TOKEN not set' }
  } else {
    try {
      const r = await fetch(
        'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: 'a red circle', parameters: { num_inference_steps: 1, width: 64, height: 64 } }),
        }
      )
      results.huggingface = r.ok
        ? { ok: true, detail: `HTTP ${r.status}, ${r.headers.get('content-type')}` }
        : { ok: false, detail: `HTTP ${r.status}: ${await r.text().then(t => t.slice(0, 100))}` }
    } catch (e) {
      results.huggingface = { ok: false, detail: String(e) }
    }
  }

  // 3. Supabase service role key (just check env is present — we don't call the DB here)
  const srvKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  results.supabase_service_role = srvKey
    ? { ok: true, detail: `set (${srvKey.length} chars)` }
    : { ok: false, detail: 'SUPABASE_SERVICE_ROLE_KEY not set' }

  const allOk = Object.values(results).every(r => r.ok)
  return NextResponse.json({ allOk, results }, { status: allOk ? 200 : 500 })
}
