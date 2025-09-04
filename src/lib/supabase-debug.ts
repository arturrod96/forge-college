import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/config/supabase'

/**
 * Debug version of Supabase client to investigate connection issues
 */
export function createDebugClient() {
  const { url, anonKey } = supabaseConfig
  
  console.log('Debug: Supabase URL:', url);
  console.log('Debug: Supabase Key (first 20 chars):', anonKey.substring(0, 20) + '...');
  
  return createClient(url, anonKey, {
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
            ...(options as any).headers,
            'User-Agent': 'forge-college-debug/1.0'
          }
        }).then(response => {
          console.log('Debug: Response status:', response.status);
          console.log('Debug: Response headers:', Object.fromEntries(response.headers.entries()));
          
          const clonedResponse = response.clone();
          
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
    const { url, anonKey } = supabaseConfig
    
    console.log('Testing Supabase connection...');
    
    // Test with a simple health check first
    const healthResponse = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': anonKey
      }
    });
    
    console.log('Health check status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      throw new Error(`Supabase health check failed: ${healthResponse.status}`);
    }
    
    // Try to test auth endpoint specifically
    let authResponse: Response | undefined;
    let authStatus = 'unknown';
    let authResponseText = 'Could not read response';

    try {
      authResponse = await fetch(`${url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456'
        })
      });

      authStatus = authResponse.status.toString();
      console.log('Auth endpoint status:', authResponse.status);

      const clonedResponse = authResponse.clone();

      try {
        authResponseText = await clonedResponse.text();
        console.log('Auth response:', authResponseText.substring(0, 200));
      } catch (textError) {
        console.log('Could not read auth response text:', textError);
        authResponseText = `Error reading response: ${textError}`;
      }

    } catch (fetchError) {
      console.error('Auth endpoint fetch failed:', fetchError);
      authStatus = 'fetch_failed';
      authResponseText = `Fetch error: ${fetchError}`;
    }
    
    return {
      success: true,
      healthStatus: healthResponse.status,
      authStatus: authStatus,
      authResponse: authResponseText
    };
    
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
