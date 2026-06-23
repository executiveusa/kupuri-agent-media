'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-logo">VozViva</span>

        <h1 className="login-title">Accede a tu cuenta</h1>
        <p className="login-sub">
          Ingresa tu correo y te enviamos un enlace de acceso. Sin
          contraseña.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && (
              <p
                style={{
                  color: 'var(--clay)',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        ) : (
          <div className="login-success">
            Revisa tu correo — te enviamos un enlace de acceso. Puede
            tardar unos segundos.
          </div>
        )}

        <p
          style={{
            marginTop: '24px',
            fontSize: '0.825rem',
            color: 'var(--ink-40)',
            textAlign: 'center',
          }}
        >
          <a href="/" style={{ color: 'var(--ink-80)' }}>
            Volver al inicio
          </a>
        </p>
      </div>
    </div>
  )
}
