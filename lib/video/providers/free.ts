import { createClient } from '@supabase/supabase-js'
import type { VideoJob, VideoResult, VideoProvider_Interface } from '../types'
import { generateScript } from '../script'

const HF_API = 'https://router.huggingface.co/hf-inference/models'

async function hfPost(model: string, body: object, token: string): Promise<ArrayBuffer> {
  const res = await fetch(`${HF_API}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`HuggingFace [${model}] HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.arrayBuffer()
}

async function uploadToStorage(
  data: ArrayBuffer,
  path: string,
  mimeType: string
): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { error } = await supabase.storage
    .from('vozviva-media')
    .upload(path, data, { contentType: mimeType, upsert: true })
  if (error) throw new Error(`Storage upload failed: ${error.message}`)
  const {
    data: { publicUrl },
  } = supabase.storage.from('vozviva-media').getPublicUrl(path)
  return publicUrl
}

export const freeProvider: VideoProvider_Interface = {
  name: 'free',

  async createVideo(job: VideoJob): Promise<VideoResult> {
    const hfToken = process.env.HF_TOKEN
    if (!hfToken) throw new Error('HF_TOKEN env var is required for the free provider')

    // Step 1: Script via Groq (free) or OpenAI fallback
    let script = job.script
    if (!script?.trim()) {
      script = await generateScript(job.actorDescription || 'negocio local')
    }

    const ts = Date.now()

    // Step 2: Portrait image with FLUX.1-schnell (free, 4-step fast mode)
    const actorPrompt = job.actorDescription
      ? `Professional portrait photo of ${job.actorDescription}, looking directly at camera, clean white background, soft studio lighting, photorealistic`
      : 'Professional portrait photo of a friendly young woman, business casual attire, looking directly at camera, clean white background, soft studio lighting, photorealistic'

    const imageData = await hfPost(
      'black-forest-labs/FLUX.1-schnell',
      { inputs: actorPrompt, parameters: { num_inference_steps: 4, width: 576, height: 1024 } },
      hfToken
    )
    const thumbnailUrl = await uploadToStorage(
      imageData,
      `${job.userId}/${job.id}/portrait_${ts}.jpg`,
      'image/jpeg'
    )

    // Step 3: Spanish TTS with MMS-TTS (free HF model)
    const audioData = await hfPost(
      'facebook/mms-tts-spa',
      { inputs: script },
      hfToken
    )
    const audioUrl = await uploadToStorage(
      audioData,
      `${job.userId}/${job.id}/voiceover_${ts}.flac`,
      'audio/flac'
    )

    // Free tier: portrait image + voiceover audio (no lip-sync)
    // video_url stores the audio; dashboard detects provider='free' and shows audio+image player
    return {
      videoUrl: audioUrl,
      thumbnailUrl,
    }
  },
}
