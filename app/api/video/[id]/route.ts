import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: video, error } = await supabase
    .from('videos')
    .select('id, status, video_url, thumbnail_url, created_at, type, title')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !video) {
    return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    id: video.id,
    status: video.status,
    video_url: video.video_url,
    thumbnail_url: video.thumbnail_url,
    created_at: video.created_at,
    type: video.type,
    title: video.title,
  })
}
