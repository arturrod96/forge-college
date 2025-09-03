import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { cookies as CookiesFn } from 'next/headers'

/**
 * Creates a Supabase client for browser-side operations
 * Used in client components for authentication
 */
export function createClientBrowser() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdeblavnrrnoyqivydsg.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI';

  return createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit', // Changed from 'pkce' to 'implicit' for better compatibility
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
