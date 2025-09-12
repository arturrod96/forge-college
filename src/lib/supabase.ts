import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { cookies as CookiesFn } from 'next/headers'
import { supabaseConfig } from '@/config/supabase'

// Maintain a single browser client instance to avoid multiple GoTrue clients
let browserClient: ReturnType<typeof createClient> | null = null

/**
 * Creates (or returns) a singleton Supabase client for browser-side operations
 */
export function createClientBrowser() {
  if (browserClient) return browserClient

  const { url, anonKey } = supabaseConfig

  browserClient = createClient(
    url,
    anonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: process.env.NODE_ENV === 'development'
      },
      global: {
        headers: {
          'X-Client-Info': 'forge-college-web'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )

  return browserClient
}

/**
 * Creates a Supabase client for server-side operations
 * Used in server components and API routes for session management
 */
export function createClientServer(cookies: ReturnType<typeof CookiesFn>) {
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookies().set({ name, value: '', ...options })
        }
      }
    }
  )
}
