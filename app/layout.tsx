import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VozViva — Videos para redes en español, sin grabarte',
  description:
    'Crea anuncios, reels y videos para redes sociales con personas virtuales, voz en español y subtítulos. Sin grabarte. Sin editar.',
  openGraph: {
    title: 'VozViva — Videos para redes en español, sin grabarte',
    description:
      'Escribe tu idea y recibe un video listo para publicar en TikTok, Instagram Reels y YouTube Shorts.',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-MX" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
