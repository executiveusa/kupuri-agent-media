import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import type { VideoJob, VideoResult, VideoProvider_Interface } from '../types'
import { generateScript } from '../script'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function updateVideoStatus(
  id: string,
  update: Record<string, unknown>
) {
  await supabase
    .from('videos')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
}

export const replicateProvider: VideoProvider_Interface = {
  name: 'replicate',

  async createVideo(job: VideoJob): Promise<VideoResult> {
    // Step 1: Ensure we have a script
    let script = job.script
    if (!script?.trim()) {
      script = await generateScript(job.actorDescription || 'negocio local')
      await updateVideoStatus(job.id, { script })
    }

    await updateVideoStatus(job.id, { status: 'processing' })

    // Step 2: Generate portrait image with Flux 1.1 Pro
    const actorPrompt = job.actorDescription
      ? `Professional portrait photo of ${job.actorDescription}, looking directly at camera, clean white background, soft studio lighting, high quality, photorealistic`
      : 'Professional portrait photo of a friendly young woman, business casual, looking directly at camera, clean white background, soft studio lighting, high quality, photorealistic'

    const portraitOutput = await replicate.run('black-forest-labs/flux-1.1-pro', {
      input: {
        prompt: actorPrompt,
        aspect_ratio: '9:16',
        output_format: 'webp',
        output_quality: 90,
        safety_tolerance: 2,
      },
    })

    const portraitUrl = Array.isArray(portraitOutput)
      ? (portraitOutput[0] as unknown as string)
      : (portraitOutput as unknown as string)

    if (!portraitUrl) {
      throw new Error('No se pudo generar el retrato')
    }

    // Step 3: TTS with XTTS v2
    const ttsOutput = await replicate.run('lucataco/xtts-v2', {
      input: {
        text: script,
        speaker: 'https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0HERRQ5g4QlgehqQlMfFM9XiWXzHPFO/male.wav',
        language: 'es',
        cleanup_voice: false,
      },
    })

    const audioUrl = ttsOutput as unknown as string
    if (!audioUrl) {
      throw new Error('No se pudo generar el audio')
    }

    // Step 4: Lip-sync with Hallo
    const lipsyncOutput = await replicate.run('zsxkib/hallo', {
      input: {
        source_image: portraitUrl,
        driving_audio: audioUrl,
        pose_weight: 1.0,
        face_weight: 1.0,
        lip_weight: 1.0,
        face_expand_ratio: 1.2,
      },
    })

    const lipsyncVideoUrl = lipsyncOutput as unknown as string
    if (!lipsyncVideoUrl) {
      throw new Error('No se pudo generar el video con lip-sync')
    }

    // Step 5: Generate subtitles with Incredibly Fast Whisper
    const subtitleOutput = await replicate.run('vaibhavs10/incredibly-fast-whisper', {
      input: {
        audio: audioUrl,
        language: 'spanish',
        task: 'transcribe',
        timestamp: 'word',
        batch_size: 24,
      },
    })

    const subtitles = subtitleOutput as unknown as { text: string }
    void subtitles // Subtitles generated; in production, burn them into video

    // For now, return the lip-sync video as the final result
    // In production, you'd use ffmpeg to burn subtitles into the video
    const videoUrl = lipsyncVideoUrl

    return {
      videoUrl,
      thumbnailUrl: portraitUrl,
    }
  },
}
