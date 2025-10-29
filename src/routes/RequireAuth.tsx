import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useOAuth'
import { shouldUseMockAuth } from '@/lib/supabase-simple'
import { LOGIN } from '@/routes/paths'

type RequireAuthProps = {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Check for mock authentication in development
  const isMockMode = shouldUseMockAuth()
  const mockUser = isMockMode ? localStorage.getItem('mock-auth-user') : null
  const isMockAuthenticated = isMockMode && mockUser

  if (loading && !isMockMode) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  // Allow access if either real auth or mock auth is valid
  if (!user && !isMockAuthenticated) {
    return <Navigate to={LOGIN} replace state={{ from: location }} />
  }

  return <>{children}</>
}
