'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { VideoType, VideoProvider } from '@/lib/video/types'

type Step = 1 | 2 | 3

interface FormData {
  type: VideoType | ''
  script: string
  actorDescription: string
  productImageUrl: string
  brollUrl: string
  provider: VideoProvider | ''
}

const VIDEO_TYPES: { id: VideoType; title: string; desc: string }[] = [
  {
    id: 'ugc_selfie',
    title: 'UGC Selfie',
    desc: 'Persona virtual hablando a cámara. Ideal para testimonios y promociones directas.',
  },
  {
    id: 'broll_talking_head',
    title: 'Talking Head con B-Roll',
    desc: 'Persona virtual con imágenes de fondo. Ideal para explicaciones y productos.',
  },
  {
    id: 'product_demo',
    title: 'Demo de Producto',
    desc: 'Muestra tu producto con voz en off y subtítulos. Ideal para e-commerce.',
  },
]

const PROVIDERS: { id: VideoProvider; name: string; badge: string; badgeClass: string; desc: string }[] = [
  {
    id: 'replicate',
    name: 'Estándar',
    badge: 'Código abierto',
    badgeClass: 'provider-card-badge--free',
    desc: 'Generación con modelos de código abierto. Incluido en tu plan. Ideal para pruebas y contenido frecuente.',
  },
  {
    id: 'heygen',
    name: 'Prémium',
    badge: 'HeyGen',
    badgeClass: 'provider-card-badge--premium',
    desc: 'Avatares HeyGen de alta calidad. Mayor realismo y naturalidad. Requiere créditos adicionales.',
  },
]

export default function CreateVideoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    type: '',
    script: '',
    actorDescription: '',
    productImageUrl: '',
    brollUrl: '',
    provider: '',
  })

  const canAdvanceStep1 = formData.type !== ''
  const canAdvanceStep2 = formData.script.trim().length > 0 || formData.actorDescription.trim().length > 0
  const canAdvanceStep3 = formData.provider !== ''

  const handleSubmit = async () => {
    if (!canAdvanceStep3) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/video/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          script: formData.script,
          actorDescription: formData.actorDescription,
          provider: formData.provider,
          productImageUrl: formData.productImageUrl || undefined,
          brollUrl: formData.brollUrl || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Error al crear el video')
      }

      router.push('/dashboard?created=1')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Crear Video</h1>
      </div>

      {/* Step indicator */}
      <div className="wizard-steps">
        {([1, 2, 3] as const).map((s, i) => (
          <>
            <div
              key={s}
              className={`wizard-step ${step === s ? 'active' : step > s ? 'done' : ''}`}
            >
              <div className="wizard-step-num">{s}</div>
              <span>
                {s === 1 ? 'Tipo' : s === 2 ? 'Contenido' : 'Proveedor'}
              </span>
            </div>
            {i < 2 && <div key={`connector-${s}`} className="wizard-connector" />}
          </>
        ))}
      </div>

      {/* Step 1: Choose video type */}
      {step === 1 && (
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-d)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '6px',
            }}
          >
            Elige el tipo de video
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-80)' }}>
            Cada tipo tiene un estilo distinto. Puedes cambiar esto en el
            siguiente video.
          </p>

          <div className="type-cards">
            {VIDEO_TYPES.map((vt) => (
              <div
                key={vt.id}
                className={`type-card ${formData.type === vt.id ? 'selected' : ''}`}
                onClick={() => setFormData((d) => ({ ...d, type: vt.id }))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    setFormData((d) => ({ ...d, type: vt.id }))
                }}
              >
                <div className="type-card-title">{vt.title}</div>
                <div className="type-card-desc">{vt.desc}</div>
              </div>
            ))}
          </div>

          <div className="wizard-nav">
            <a href="/dashboard" className="btn btn-ghost btn-sm">
              Cancelar
            </a>
            <button
              className="btn btn-primary btn-sm"
              disabled={!canAdvanceStep1}
              onClick={() => setStep(2)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Script and actor */}
      {step === 2 && (
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-d)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '6px',
            }}
          >
            Cuéntanos tu idea
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-80)', marginBottom: '24px' }}>
            El guion lo puedes escribir tú o dejarlo en blanco para que lo
            generemos automáticamente.
          </p>

          <div className="form-group">
            <label htmlFor="script" className="form-label">
              Guion o idea principal
            </label>
            <textarea
              id="script"
              className="form-textarea"
              placeholder='Ej. "Promociona mi masaje relajante de 60 minutos con 20% de descuento este fin de semana"'
              value={formData.script}
              onChange={(e) =>
                setFormData((d) => ({ ...d, script: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="actor" className="form-label">
              Descripción del presentador (opcional)
            </label>
            <input
              id="actor"
              type="text"
              className="form-input"
              placeholder='Ej. "Mujer joven, profesional, tono amigable"'
              value={formData.actorDescription}
              onChange={(e) =>
                setFormData((d) => ({
                  ...d,
                  actorDescription: e.target.value,
                }))
              }
            />
          </div>

          {(formData.type === 'product_demo' ||
            formData.type === 'broll_talking_head') && (
            <>
              <div className="form-group">
                <label htmlFor="productImage" className="form-label">
                  URL de imagen del producto (opcional)
                </label>
                <input
                  id="productImage"
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.productImageUrl}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      productImageUrl: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="broll" className="form-label">
                  URL de video B-roll (opcional)
                </label>
                <input
                  id="broll"
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.brollUrl}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, brollUrl: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          <div className="wizard-nav">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setStep(1)}
            >
              Atrás
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={!canAdvanceStep2}
              onClick={() => setStep(3)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose provider and confirm */}
      {step === 3 && (
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-d)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '6px',
            }}
          >
            Elige el proveedor
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-80)' }}>
            Selecciona la calidad de generación para este video.
          </p>

          <div className="provider-cards">
            {PROVIDERS.map((prov) => (
              <div
                key={prov.id}
                className={`provider-card ${formData.provider === prov.id ? 'selected' : ''}`}
                onClick={() =>
                  setFormData((d) => ({ ...d, provider: prov.id }))
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    setFormData((d) => ({ ...d, provider: prov.id }))
                }}
              >
                <div className="provider-card-name">{prov.name}</div>
                <div
                  className={`provider-card-badge ${prov.badgeClass}`}
                >
                  {prov.badge}
                </div>
                <div className="provider-card-desc">{prov.desc}</div>
              </div>
            ))}
          </div>

          {error && (
            <p
              style={{
                color: 'var(--clay)',
                fontSize: '0.875rem',
                marginTop: '16px',
              }}
            >
              {error}
            </p>
          )}

          <div className="wizard-nav">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setStep(2)}
            >
              Atrás
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={!canAdvanceStep3 || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Creando...' : 'Crear video'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
