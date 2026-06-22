import { createClient } from '@supabase/supabase-js'
import type { VideoJob, VideoProvider, VideoType, VideoProvider_Interface } from './types'
import { replicateProvider } from './providers/replicate'
import { heygenProvider } from './providers/heygen'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PROVIDERS: Record<VideoProvider, VideoProvider_Interface> = {
  replicate: replicateProvider,
  heygen: heygenProvider,
}

export function selectProvider(
  requestedProvider: VideoProvider,
  _type: VideoType
): VideoProvider_Interface {
  const provider = PROVIDERS[requestedProvider]
  if (!provider) {
    throw new Error(`Unknown provider: ${requestedProvider}`)
  }
  return provider
}

export async function createVideo(job: VideoJob): Promise<void> {
  const provider = selectProvider(job.provider, job.type)

  try {
    const result = await provider.createVideo(job)

    await supabase
      .from('videos')
      .update({
        status: 'ready',
        video_url: result.videoUrl,
        thumbnail_url: result.thumbnailUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    await supabase
      .from('videos')
      .update({
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)

    throw error
  }
}
