import { createClient } from '@supabase/supabase-js'

/**
 * Simple Supabase client for testing without complex authentication flows
 */
export function createSimpleClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdeblavnrrnoyqivydsg.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI';
  
  // Basic client with minimal configuration
  return createClient(supabaseUrl, supabaseKey, {
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login for demo@example.com
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
    
    // Mock error for invalid credentials
    return {
      data: { user: null, session: null },
      error: {
        message: 'Invalid login credentials',
        status: 400
      }
    };
  },
  
  signInWithOAuth: async ({ provider }: { provider: string }) => {
    // Simulate OAuth redirect
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
