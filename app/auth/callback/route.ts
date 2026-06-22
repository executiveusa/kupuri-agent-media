import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    // Collect cookies Supabase wants to set, then apply to the redirect response
    const pending: { name: string; value: string; options?: Record<string, unknown> }[] = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            pending.push(...cookiesToSet)
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`)
      pending.forEach(({ name, value, options }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.cookies.set(name, value, options as any)
      })
      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
