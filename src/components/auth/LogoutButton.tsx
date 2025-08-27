import { useOAuth } from '@/hooks/useOAuth'

interface LogoutButtonProps {
  className?: string
  variant?: 'default' | 'minimal' | 'icon'
  children?: React.ReactNode
}

export function LogoutButton({ 
  className = '', 
  variant = 'default',
  children 
}: LogoutButtonProps) {
  const { signOut, loading } = useOAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Minimal variant - just text
  if (variant === 'minimal') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 ${className}`}
      >
        {children || 'Sign out'}
      </button>
    )
  }

  // Icon variant - just an icon
  if (variant === 'icon') {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full disabled:opacity-50 ${className}`}
        title="Sign out"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    )
  }

  // Default variant - full button
  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forge-orange hover:bg-forge-orange-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forge-orange disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing out...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {children || 'Sign out'}
        </>
      )}
    </button>
  )
}

