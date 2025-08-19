import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LOGIN } from '@/routes/paths'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { session, initialized } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Navigate to={LOGIN} replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default RequireAuth


