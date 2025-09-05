import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/config/supabase'

/**
 * Simple Supabase client for testing without complex authentication flows
 */
export function createSimpleClient() {
  const { url, anonKey } = supabaseConfig
  
  // Basic client with minimal configuration
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'forge-college-simple'
      }
    }
  });
}

/**
 * Mock authentication for development when Supabase is not available
 */
export const mockAuth = {
  signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email: 'demo@example.com',
            user_metadata: {
              name: 'Demo User'
            }
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        },
        error: null
      };
    }
    
    return {
      data: { user: null, session: null },
      error: {
        message: 'Invalid login credentials',
        status: 400
      }
    };
  },
  
  signInWithOAuth: async ({ provider }: { provider: string }) => {
    console.log(`Mock OAuth redirect for ${provider}`);
    window.location.href = `/auth/callback?provider=${provider}&mock=true`;
    return { data: null, error: null };
  },
  
  signOut: async () => {
    return { error: null };
  },
  
  getSession: async () => {
    return {
      data: { session: null },
      error: null
    };
  },
  
  onAuthStateChange: () => {
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};

/**
 * Check if we should use mock authentication
 */
export function shouldUseMockAuth(): boolean {
  // Explicit opt-in via env flag only
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
}
