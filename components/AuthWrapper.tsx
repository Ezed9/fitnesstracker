import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Subscription } from '@supabase/supabase-js'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const isAuthPage = ['/login', '/register', '/auth/callback'].includes(router.pathname)

  useEffect(() => {
    let isMounted = true
    let subscription: Subscription | null = null

    const checkAuth = async () => {
      try {
        const { 
          data: { session }, 
          error: sessionError 
        } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (sessionError) {
          throw sessionError
        }
        
        if (!session && !isAuthPage) {
          // If no session and not on an auth page, redirect to login
          router.push('/login')
          return
        }

        if (session && isAuthPage) {
          // If session exists and user is on an auth page, redirect to dashboard
          router.push('/')
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking auth status:', error)
        if (isMounted) {
          setError('Failed to check authentication status. Please try again.')
          setLoading(false)
        }
      }
    }

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted) return
      
      if (event === 'SIGNED_OUT' && !isAuthPage) {
        router.push('/login')
      } else if (event === 'SIGNED_IN' && isAuthPage) {
        router.push('/')
      }
    })
    
    // Store the subscription for cleanup
    subscription = data.subscription

    // Initial auth check
    checkAuth()

    // Cleanup function
    return () => {
      isMounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router, supabase, isAuthPage])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
