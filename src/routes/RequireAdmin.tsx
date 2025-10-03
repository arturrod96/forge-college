import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useOAuth'
import { shouldUseMockAuth } from '@/lib/supabase-simple'
import { DASHBOARD } from '@/routes/paths'

type RequireAdminProps = {
  children: ReactNode
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  const isMockMode = shouldUseMockAuth()
  const mockUserRaw = isMockMode ? localStorage.getItem('mock-auth-user') : null
  let mockUser: { is_admin?: boolean } | null = null

  if (mockUserRaw) {
    try {
      mockUser = JSON.parse(mockUserRaw)
    } catch (error) {
      console.warn('Failed to parse mock admin user payload', error)
    }
  }

  const isAdmin = Boolean(user?.app_metadata?.is_admin || mockUser?.is_admin)

  if (loading && !isMockMode) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
        Checking admin permissions...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to={DASHBOARD} replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default RequireAdmin
