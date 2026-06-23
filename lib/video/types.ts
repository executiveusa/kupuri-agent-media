export type VideoProvider = 'replicate' | 'heygen'
export type VideoType = 'ugc_selfie' | 'broll_talking_head' | 'product_demo'
export type VideoStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface VideoJob {
  id: string
  userId: string
  type: VideoType
  script: string
  actorDescription: string
  provider: VideoProvider
  productImageUrl?: string
  brollUrl?: string
}

export interface VideoResult {
  videoUrl: string
  thumbnailUrl?: string
  durationSeconds?: number
}

export interface VideoProvider_Interface {
  name: VideoProvider
  createVideo(job: VideoJob): Promise<VideoResult>
}
