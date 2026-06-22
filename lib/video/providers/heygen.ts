import type { VideoJob, VideoResult, VideoProvider_Interface } from '../types'

const HEYGEN_API_BASE = 'https://api.heygen.com'

// Default Spanish-speaking avatar and voice IDs
// Replace with real IDs from your HeyGen account
const DEFAULT_AVATAR_ID = 'Daisy-inskirt-20220818'
const DEFAULT_VOICE_ID = 'es-MX-DaliaNeural'

interface HeyGenVideoInput {
  character: {
    type: 'avatar'
    avatar_id: string
    avatar_style?: string
  }
  voice: {
    type: 'text'
    input_text: string
    voice_id: string
    speed?: number
  }
  background?: {
    type: 'color'
    value: string
  }
}

interface HeyGenGenerateResponse {
  error: string | null
  data: {
    video_id: string
  } | null
}

interface HeyGenStatusResponse {
  error: string | null
  data: {
    video_id: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    video_url?: string
    thumbnail_url?: string
    duration?: number
    error?: string
  } | null
}

async function pollVideoStatus(videoId: string, maxAttempts = 60): Promise<HeyGenStatusResponse['data']> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(
      `${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`,
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) {
      throw new Error(`HeyGen status check failed: ${res.status}`)
    }

    const data: HeyGenStatusResponse = await res.json()

    if (data.error) {
      throw new Error(`HeyGen error: ${data.error}`)
    }

    const status = data.data?.status

    if (status === 'completed') {
      return data.data!
    }

    if (status === 'failed') {
      throw new Error(data.data?.error ?? 'HeyGen video generation failed')
    }

    // Wait 5 seconds between polls
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }

  throw new Error('HeyGen video generation timed out')
}

export const heygenProvider: VideoProvider_Interface = {
  name: 'heygen',

  async createVideo(job: VideoJob): Promise<VideoResult> {
    const script = job.script
    if (!script?.trim()) {
      throw new Error('Script is required for HeyGen generation')
    }

    const videoInputs: HeyGenVideoInput[] = [
      {
        character: {
          type: 'avatar',
          avatar_id: DEFAULT_AVATAR_ID,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text',
          input_text: script,
          voice_id: DEFAULT_VOICE_ID,
          speed: 1.0,
        },
        background: {
          type: 'color',
          value: '#ffffff',
        },
      },
    ]

    // Create video
    const createRes = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.HEYGEN_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_inputs: videoInputs,
        dimension: {
          width: 1080,
          height: 1920,
        },
        test: false,
      }),
    })

    if (!createRes.ok) {
      const errorText = await createRes.text()
      throw new Error(`HeyGen create failed: ${createRes.status} — ${errorText}`)
    }

    const createData: HeyGenGenerateResponse = await createRes.json()

    if (createData.error || !createData.data?.video_id) {
      throw new Error(createData.error ?? 'HeyGen did not return a video ID')
    }

    const videoId = createData.data.video_id

    // Poll until completed
    const completedVideo = await pollVideoStatus(videoId)

    if (!completedVideo?.video_url) {
      throw new Error('HeyGen did not return a video URL')
    }

    return {
      videoUrl: completedVideo.video_url,
      thumbnailUrl: completedVideo.thumbnail_url,
      durationSeconds: completedVideo.duration,
    }
  },
}
