import { useState, useEffect, createContext, useContext, ReactNode, useMemo, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClientBrowser } from '@/lib/supabase'

// Types for the auth context
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props for the auth provider
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication Provider Component
 * Manages OAuth authentication state across the application
 */
export function OAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)
  
  // Create a single Supabase client instance
  const supabase = useMemo(() => createClientBrowser(), [])

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Starting sign out process...')
      
      // Force sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      console.log('Supabase sign out successful')
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Clear any remaining cookies or local storage
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('supabase.auth.refreshToken')
      
      // Clear Google OAuth specific tokens if they exist
      const googleTokens = Object.keys(localStorage).filter(key => 
        key.includes('google') || key.includes('oauth') || key.includes('auth')
      )
      googleTokens.forEach(key => {
        console.log('Removing Google/OAuth token:', key)
        localStorage.removeItem(key)
      })
      
      // Clear all cookies related to authentication
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      sessionStorage.clear()
      
      console.log('Local storage cleared, redirecting...')
      
      // Force page reload to clear any remaining state
      // Use replace to prevent back button from going to authenticated pages
      window.location.replace('/')
      
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, try to clear local state and redirect
      setUser(null)
      setSession(null)
      window.location.href = '/'
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh the current session
   */
  const refreshSession = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error refreshing session:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    mountedRef.current = true
    
    /**
     * Initialize authentication state
     */
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (mountedRef.current) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    // Initialize auth state
    initializeAuth()

    /**
     * Listen for auth state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return
        
        console.log('Auth state changed:', event, session?.user?.email, 'Provider:', session?.user?.app_metadata?.provider)
        
        // Handle different auth events properly
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'INITIAL_SESSION':
            if (session?.user) {
              setSession(session)
              setUser(session.user)
              setLoading(false)
            }
            break
          case 'SIGNED_OUT':
            setSession(null)
            setUser(null)
            setLoading(false)
            break
          default:
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = useMemo(() => ({
    user,
    session,
    loading,
    signOut,
    refreshSession,
  }), [user, session, loading, signOut, refreshSession])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use the OAuth authentication context
 * @returns The authentication context
 */
export function useOAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useOAuth must be used within an OAuthProvider')
  }
  return context
}

/**
 * Hook to check if user is authenticated
 * @returns Object with isAuthenticated and user properties
 */
export function useAuth() {
  const { user, session, loading } = useOAuth()
  return {
    isAuthenticated: !!user && !loading,
    user: user || null,
    session: session || null,
    loading: loading || false,
  }
}

