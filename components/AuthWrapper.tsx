import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Subscription, Session } from '@supabase/supabase-js'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  // List of public routes that don't require authentication
  const publicRoutes = [
    '/login', 
    '/signup', 
    '/auth/callback', 
    '/auth/confirm-email',
    '/auth/forgot-password',
    '/auth/reset-password'
  ]
  
  const isAuthPage = publicRoutes.includes(router.pathname)

  useEffect(() => {
    let isMounted = true
    let subscription: Subscription | null = null

    const getSession = async () => {
      try {
        const { 
          data: { session: currentSession }, 
          error: sessionError 
        } = await supabase.auth.getSession()
        
        if (!isMounted) return

        if (sessionError) {
          throw sessionError
        }

        setSession(currentSession)

        if (!currentSession && !isAuthPage) {
          // If no session and not on a public page, redirect to login
          router.push('/login')
          return
        }

        if (currentSession && isAuthPage && !router.pathname.startsWith('/auth/confirm-email')) {
          // If session exists and user is on an auth page (except email confirmation), redirect to dashboard
          router.push('/dashboard')
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
    const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return
      
      setSession(currentSession)
      
      if (event === 'SIGNED_OUT' && !isAuthPage) {
        router.push('/login')
      } else if (event === 'SIGNED_IN' && isAuthPage && !router.pathname.startsWith('/auth/confirm-email')) {
        router.push('/dashboard')
      }
    })
    
    // Store the subscription for cleanup
    subscription = data.subscription

    getSession()

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
