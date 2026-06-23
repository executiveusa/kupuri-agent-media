#!/usr/bin/env node
/**
 * Smoke test for the free UGC provider.
 * Usage: node scripts/test-free-provider.mjs
 * Requires: HF_TOKEN and GROQ_API_KEY in env (or .env.local)
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local if present
const envFile = resolve(__dirname, '../.env.local')
if (existsSync(envFile)) {
  const lines = readFileSync(envFile, 'utf8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const HF_TOKEN = process.env.HF_TOKEN
const GROQ_API_KEY = process.env.GROQ_API_KEY

console.log('=== Free Provider Smoke Test ===\n')

// ── 1. Script generation (Groq) ──────────────────────────────────────────────
console.log('1. Testing script generation...')
if (!GROQ_API_KEY) {
  console.warn('   ⚠  GROQ_API_KEY not set — skipping script test')
} else {
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'Genera un script de marketing en español mexicano, máximo 40 palabras.' },
        { role: 'user', content: 'Genera un script para: spa de relajación con masajes.' },
      ],
      max_tokens: 100,
    }),
  })
  if (!groqRes.ok) {
    const err = await groqRes.text()
    throw new Error(`Groq failed: ${groqRes.status} — ${err}`)
  }
  const groqData = await groqRes.json()
  const script = groqData.choices?.[0]?.message?.content ?? ''
  console.log('   ✓ Script:', script.slice(0, 120))
}

// ── 2. Portrait image (FLUX.1-schnell via HF) ────────────────────────────────
console.log('\n2. Testing FLUX.1-schnell image generation...')
if (!HF_TOKEN) {
  console.warn('   ⚠  HF_TOKEN not set — skipping image test')
} else {
  const imageRes = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Professional portrait photo of a friendly young woman, business casual, white background, studio lighting',
        parameters: { num_inference_steps: 4, width: 576, height: 1024 },
      }),
    }
  )
  if (!imageRes.ok) {
    const err = await imageRes.text()
    throw new Error(`FLUX failed: ${imageRes.status} — ${err.slice(0, 200)}`)
  }
  const imageBytes = await imageRes.arrayBuffer()
  console.log(`   ✓ Image: ${(imageBytes.byteLength / 1024).toFixed(0)} KB received`)
}

// ── 3. Spanish TTS (MMS-TTS via HF) ─────────────────────────────────────────
console.log('\n3. Testing MMS-TTS Spanish audio generation...')
if (!HF_TOKEN) {
  console.warn('   ⚠  HF_TOKEN not set — skipping TTS test')
} else {
  const ttsRes = await fetch(
    'https://router.huggingface.co/hf-inference/models/facebook/mms-tts-spa',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hola, este es un video de prueba para nuestro spa de relajación. Visítanos hoy.',
      }),
    }
  )
  if (!ttsRes.ok) {
    const err = await ttsRes.text()
    throw new Error(`MMS-TTS failed: ${ttsRes.status} — ${err.slice(0, 200)}`)
  }
  const audioBytes = await ttsRes.arrayBuffer()
  console.log(`   ✓ Audio: ${(audioBytes.byteLength / 1024).toFixed(0)} KB received`)
}

console.log('\n=== All tests passed ✓ ===')
console.log('\nReady to generate free UGC demos from the dashboard.')
console.log('Select "Demo Gratis" provider when creating a video.')
