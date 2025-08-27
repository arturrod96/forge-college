'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClientBrowser } from '@/lib/supabase'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Signing you in...')
  const navigate = useNavigate()
  const supabase = createClientBrowser()

  useEffect(() => {
        /**
     * Handle the OAuth callback and session setup
     */
    async function handleCallback() {
      try {
        // Wait for OAuth flow to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (session?.user) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Wait a bit more to ensure the session is properly established
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Redirect to dashboard after successful authentication
          navigate('/dashboard', { replace: true })
        } else {
          // If no session, wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 2000))
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          
          if (retrySession?.user) {
            setStatus('success')
            setMessage('Authentication successful! Redirecting...')
            
            // Wait a bit more to ensure the session is properly established
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            navigate('/dashboard', { replace: true })
          } else {
            throw new Error('No session found after OAuth completion')
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        
        // Redirect back to login after error
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [navigate, supabase.auth])

  return (
    <div className="min-h-screen bg-forge-cream relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forge-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-forge-orange/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm border border-forge-orange/20 shadow-xl rounded-2xl p-8 relative z-10">
        <div className="text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-forge-orange border-t-transparent"></div>
              <h2 className="text-2xl font-bold text-forge-dark">Processing Authentication</h2>
              <p className="text-forge-gray">{message}</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-forge-orange/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-forge-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-forge-dark">Welcome to Forge College!</h2>
              <p className="text-forge-gray">{message}</p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-forge-dark">Authentication Failed</h2>
              <p className="text-forge-gray">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forge-orange hover:bg-forge-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
