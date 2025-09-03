import { createClient } from '@supabase/supabase-js'

/**
 * Debug version of Supabase client to investigate connection issues
 */
export function createDebugClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdeblavnrrnoyqivydsg.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI';
  
  console.log('Debug: Supabase URL:', supabaseUrl);
  console.log('Debug: Supabase Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false, // Disable auto refresh for debugging
      persistSession: false,   // Disable session persistence for debugging
      detectSessionInUrl: false, // Disable URL detection for debugging
      flowType: 'implicit',
      debug: true
    },
    global: {
      headers: {
        'X-Client-Info': 'forge-college-debug'
      },
      fetch: (url, options = {}) => {
        console.log('Debug: Fetch request to:', url);
        console.log('Debug: Fetch options:', options);
        
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'User-Agent': 'forge-college-debug/1.0'
          }
        }).then(response => {
          console.log('Debug: Response status:', response.status);
          console.log('Debug: Response headers:', Object.fromEntries(response.headers.entries()));
          
          // Clone the response to avoid "body stream already read" errors
          const clonedResponse = response.clone();
          
          // Log response text for debugging (but don't consume the original)
          clonedResponse.text().then(text => {
            console.log('Debug: Response body:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
          }).catch(err => {
            console.log('Debug: Could not read response body:', err);
          });
          
          return response;
        }).catch(error => {
          console.error('Debug: Fetch error:', error);
          throw error;
        });
      }
    }
  });
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const client = createDebugClient();
    
    console.log('Testing Supabase connection...');
    
    // Test with a simple health check first
    const healthResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://fdeblavnrrnoyqivydsg.supabase.co'}/rest/v1/`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI'
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      throw new Error(`Supabase health check failed: ${healthResponse.status}`);
    }
    
    // Try to test auth endpoint specifically
    const authResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://fdeblavnrrnoyqivydsg.supabase.co'}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWJsYXZucnJub3lxaXZ5ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgxMzgsImV4cCI6MjA3MDA3NDEzOH0.iaK-5qda3SZGkSwSJRB5ejyJ1Ky8S2tPOxRAPAap_FI'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123456'
      })
    });
    
    console.log('Auth endpoint status:', authResponse.status);
    
    // Try to read the response
    const responseText = await authResponse.text();
    console.log('Auth response:', responseText);
    
    return {
      success: true,
      healthStatus: healthResponse.status,
      authStatus: authResponse.status,
      authResponse: responseText
    };
    
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
