import { useState, useEffect } from 'react'
import { Menu, X, Bell, User, LogOut } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [supabase])

  const handleSignOut = async () => {
    try {
      // Close dropdown menu to prevent multiple clicks
      document.getElementById('user-dropdown')?.classList.add('hidden')
      // Set mobile menu to closed
      setMobileMenuOpen(false)
      
      // Sign out the user
      await supabase.auth.signOut()
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login')
      }, 100)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Workout', href: '/workout' },
    { name: 'Macros', href: '/macrotracker' },
    { name: 'Settings', href: '/settings' },
  ]
  
  // Function to check if a navigation item is active
  const isActive = (path: string) => {
    // Exact match for dashboard
    if (path === '/dashboard' && router.pathname === '/dashboard') return true;
    // For other pages, check if the current path starts with the nav item path
    // This handles potential sub-pages
    return path !== '/dashboard' && router.pathname.startsWith(path);
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1E1E1E]/90 backdrop-blur-md border-b border-[#333333]/30' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#A1A1AA] hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <div className="ml-4 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#4ADE80] to-[#60A5FA] bg-clip-text text-transparent tracking-tight">
                FitTrack
              </span>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-md ${active 
                      ? 'bg-[#252525] text-white' 
                      : 'text-[#A1A1AA] hover:bg-[#252525]/40 hover:text-white'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <button
              type="button"
              className="p-1.5 rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#252525] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-[#4ADE80]"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>
            
            <div className="relative group">
              <button
                type="button"
                className="flex items-center space-x-2 text-sm focus:outline-none"
                id="user-menu"
                aria-expanded="false"
                onClick={() => document.getElementById('user-dropdown')?.classList.toggle('hidden')}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#4ADE80] to-[#60A5FA] flex items-center justify-center text-white text-xs font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-[#A1A1AA] group-hover:text-white transition-colors">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </button>
              
              <div
                id="user-dropdown"
                className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#252525] py-1 z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-[#A1A1AA] hover:bg-[#333333] hover:text-white"
                  role="menuitem"
                >
                  <User className="mr-3 h-4 w-4" />
                  Your Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-[#A1A1AA] hover:bg-[#333333] hover:text-white"
                  role="menuitem"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-[#1E1E1E] border-t border-[#333333]`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${active 
                  ? 'bg-[#252525] text-white' 
                  : 'text-[#A1A1AA] hover:bg-[#252525] hover:text-white'}`}
              >
                {item.name}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></div>}
              </Link>
            );
          })}
          <div className="border-t border-[#333333] mt-2 pt-2">
            <Link
              href="/profile"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[#A1A1AA] hover:bg-[#252525] hover:text-white"
            >
              <User className="mr-3 h-5 w-5" />
              Your Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-[#A1A1AA] hover:bg-[#252525] hover:text-white"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
