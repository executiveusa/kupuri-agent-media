import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createVideo } from '@/lib/video/router'
import type { VideoType, VideoProvider } from '@/lib/video/types'

interface CreateVideoBody {
  type: VideoType
  script?: string
  actorDescription?: string
  provider: VideoProvider
  productImageUrl?: string
  brollUrl?: string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: CreateVideoBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  const { type, script, actorDescription, provider, productImageUrl, brollUrl } = body

  if (!type || !provider) {
    return NextResponse.json(
      { error: 'Los campos "type" y "provider" son requeridos' },
      { status: 400 }
    )
  }

  const validTypes: VideoType[] = ['ugc_selfie', 'broll_talking_head', 'product_demo']
  const validProviders: VideoProvider[] = ['replicate', 'heygen']

  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: `Tipo de video inválido: ${type}` }, { status: 400 })
  }

  if (!validProviders.includes(provider)) {
    return NextResponse.json({ error: `Proveedor inválido: ${provider}` }, { status: 400 })
  }

  // Insert video row
  const { data: video, error: insertError } = await supabase
    .from('videos')
    .insert({
      user_id: user.id,
      type,
      script: script ?? null,
      actor_description: actorDescription ?? null,
      provider,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertError || !video) {
    console.error('Error inserting video:', insertError)
    return NextResponse.json(
      { error: 'Error al crear el registro de video' },
      { status: 500 }
    )
  }

  // Kick off video generation asynchronously (fire and forget)
  const job = {
    id: video.id,
    userId: user.id,
    type,
    script: script ?? '',
    actorDescription: actorDescription ?? '',
    provider,
    productImageUrl,
    brollUrl,
  }

  // Run async — do not await
  createVideo(job).catch((error) => {
    console.error(`Video generation failed for ${video.id}:`, error)
  })

  return NextResponse.json({ id: video.id }, { status: 201 })
}
