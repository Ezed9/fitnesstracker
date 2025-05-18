import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useAppStore } from '@/store/app-store'

interface LayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function Layout({ children, requireAuth = true }: LayoutProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const signOut = useAuthStore((state) => state.signOut)
  const isNavOpen = useAppStore((state) => state.isNavOpen)
  const toggleNav = useAppStore((state) => state.toggleNav)

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      router.push('/login')
    }
  }, [isLoading, requireAuth, user, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (requireAuth && !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
                  FitTrack
                </Link>
              </div>
              {user && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/" className={`${router.pathname === '/' ? 'border-indigo-500' : 'border-transparent'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Dashboard
                  </Link>
                  <Link href="/diary" className={`${router.pathname === '/diary' ? 'border-indigo-500' : 'border-transparent'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Workout Diary
                  </Link>
                  <Link href="/macros" className={`${router.pathname === '/macros' ? 'border-indigo-500' : 'border-transparent'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Macros
                  </Link>
                  <Link href="/weight" className={`${router.pathname === '/weight' ? 'border-indigo-500' : 'border-transparent'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Weight
                  </Link>
                  <Link href="/analytics" className={`${router.pathname === '/analytics' ? 'border-indigo-500' : 'border-transparent'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Analytics
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
} 