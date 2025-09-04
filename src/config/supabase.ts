// Supabase Configuration
// This file handles environment-specific Supabase configuration

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Fallback configuration
const FALLBACK_CONFIG: SupabaseConfig = {
  url: 'https://fdeblavnrrnoyqivydsg.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI'
};

// Get configuration for current environment
export const getSupabaseConfig = (): SupabaseConfig => {
  // Prefer environment variables
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  if (url && anonKey) {
    return { url, anonKey };
  }

  if (useMock) {
    console.warn('Using Supabase fallback config due to VITE_USE_MOCK_AUTH=true');
    return FALLBACK_CONFIG;
  }

  throw new Error('Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
};

// Export the configuration with error handling
let supabaseConfig: SupabaseConfig;
try {
  supabaseConfig = getSupabaseConfig();
} catch (error) {
  // Keep throwing so callers can display a helpful message
  console.error('Supabase config error:', error);
  throw error;
}

export { supabaseConfig };
