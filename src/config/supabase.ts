// Supabase Configuration
// This file handles environment-specific Supabase configuration

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Get configuration for current environment
export const getSupabaseConfig = (): SupabaseConfig => {
  // Always prefer environment variables for security
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    throw new Error(
      'Configuração do Supabase ausente. Defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
    );
  }
  
  return { url, anonKey };
};

// Export the configuration
export const supabaseConfig = getSupabaseConfig(); 