import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Handle successful sign in
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Completing sign in...</p>
      </div>
    </div>
  )
}
