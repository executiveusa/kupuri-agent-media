import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // ReadonlyRequestCookies is mutable at runtime in Server Actions/Route Handlers;
              // the try-catch silences the no-op case in pure Server Components.
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(cookieStore as any).set(name, value, options)
            })
          } catch {
            // no-op: called from a Server Component; middleware refreshes the session.
          }
        },
      },
    }
  )
}
