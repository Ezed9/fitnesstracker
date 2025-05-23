import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthWrapper from '@/components/AuthWrapper'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check if user is logged in and redirect to dashboard
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  return (
    <AuthWrapper>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </AuthWrapper>
  )
}
