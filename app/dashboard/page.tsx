import { createClient } from '@/lib/supabase/server'

interface Video {
  id: string
  title: string | null
  type: string
  status: string
  provider: string
  created_at: string
  video_url: string | null
  thumbnail_url: string | null
}

function VideoCard({ video }: { video: Video }) {
  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    ready: 'Listo',
    failed: 'Error',
  }

  const formattedDate = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(video.created_at))

  return (
    <div className="video-card">
      <div className="video-card-thumb">
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail_url}
            alt={video.title ?? 'Video'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
            }}
          />
        )}
        {/* Free tier: audio play link overlay */}
        {video.provider === 'free' && video.status === 'ready' && video.video_url && (
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              background: 'var(--clay)',
              color: '#fff',
              borderRadius: 4,
              padding: '2px 7px',
              fontSize: '0.7rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ▶ Audio
          </a>
        )}
      </div>
      <div className="video-card-body">
        <div className="video-card-title">
          {video.title ?? `Video — ${video.type.replace(/_/g, ' ')}`}
        </div>
        <div className="video-card-meta">
          <span className={`video-status video-status--${video.status}`}>
            {statusLabels[video.status] ?? video.status}
          </span>
          <span className="video-card-date">{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, title, type, status, provider, created_at, video_url, thumbnail_url')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
  }

  const videoList: Video[] = videos ?? []

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Mis Videos</h1>
        <a href="/dashboard/create" className="btn btn-primary btn-sm">
          Crear video
        </a>
      </div>

      {videoList.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Aún no tienes videos</p>
          <p className="empty-state-desc">
            Crea tu primer video en minutos. Solo describe tu idea y el
            resto lo hacemos nosotros.
          </p>
          <a href="/dashboard/create" className="btn btn-primary btn-lg">
            Crea tu primer video
          </a>
        </div>
      ) : (
        <div className="videos-grid">
          {videoList.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </>
  )
}
