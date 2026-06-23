'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface DashboardShellProps {
  children: React.ReactNode
  user: User
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/dashboard', label: 'Mis Videos' },
    { href: '/dashboard/create', label: 'Crear Video' },
    { href: '/dashboard/account', label: 'Cuenta' },
  ]

  return (
    <div className="dashboard-layout">
      {/* Desktop sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">VozViva</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación del panel">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.3)',
              padding: '0 12px',
              marginBottom: '8px',
              wordBreak: 'break-all',
            }}
          >
            {user.email}
          </p>
          <button className="sidebar-signout" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="dashboard-bottom-nav" aria-label="Navegación móvil">
        <div className="bottom-nav-inner">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`bottom-nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <button
            className="bottom-nav-link"
            onClick={handleSignOut}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </nav>
    </div>
  )
}
