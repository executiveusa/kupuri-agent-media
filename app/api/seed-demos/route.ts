import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

const HF_API = 'https://router.huggingface.co/hf-inference/models'

async function hfImage(prompt: string, token: string): Promise<ArrayBuffer> {
  const res = await fetch(`${HF_API}/black-forest-labs/FLUX.1-schnell`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { num_inference_steps: 4, width: 576, height: 1024 },
    }),
  })
  if (!res.ok) throw new Error(`FLUX HTTP ${res.status}: ${await res.text().then(t => t.slice(0, 120))}`)
  return res.arrayBuffer()
}

async function uploadToStorage(data: ArrayBuffer, path: string, mime: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.storage
    .from('vozviva-media')
    .upload(path, data, { contentType: mime, upsert: true })
  if (error) throw new Error(`Storage: ${error.message}`)
  return supabase.storage.from('vozviva-media').getPublicUrl(path).data.publicUrl
}

const DEMOS = [
  {
    id: 'spa',
    prompt:
      'Professional portrait photo of a friendly young Latin American woman, spa wellness white uniform, warm serene smile, looking directly at camera, clean white studio background, soft lighting, highly photorealistic, 9:16 vertical format',
  },
  {
    id: 'restaurant',
    prompt:
      'Professional portrait photo of a confident young Latin American man, restaurant chef white uniform with apron, warm smile, looking directly at camera, clean white studio background, warm soft lighting, highly photorealistic, 9:16 vertical format',
  },
  {
    id: 'realestate',
    prompt:
      'Professional portrait photo of a smart Latin American businesswoman, professional blazer, confident welcoming smile, looking directly at camera, clean white studio background, soft professional lighting, highly photorealistic, 9:16 vertical format',
  },
]

export async function GET() {
  const hfToken = process.env.HF_TOKEN
  if (!hfToken) return NextResponse.json({ error: 'HF_TOKEN not set' }, { status: 500 })

  const results = await Promise.allSettled(
    DEMOS.map(async (demo) => {
      const imageData = await hfImage(demo.prompt, hfToken)
      const url = await uploadToStorage(imageData, `demos/${demo.id}_portrait.jpg`, 'image/jpeg')
      return { id: demo.id, url }
    })
  )

  const output: Record<string, string | null> = {}
  for (const result of results) {
    if (result.status === 'fulfilled') {
      output[result.value.id] = result.value.url
    } else {
      output['error'] = String(result.reason)
    }
  }

  return NextResponse.json(output)
}
