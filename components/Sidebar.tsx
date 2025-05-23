import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const user = useAuthStore((state) => state.user)

  const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Workout Diary', href: '/diary', icon: '🏋️' },
    { name: 'Macros', href: '/macros', icon: '🥗' },
    { name: 'Weight', href: '/weight', icon: '⚖️' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ]

  return (
    <aside className={`w-64 ${isCollapsed ? 'w-20' : ''} bg-white dark:bg-gray-800 h-screen p-4 transition-all duration-300`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FT</span>
          {!isCollapsed && <span className="text-xl font-bold">FitTrack</span>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            className={`w-5 h-5 ${isCollapsed ? 'rotate-180' : ''} transition-transform duration-300`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-start'
            } ${
              window.location.pathname === item.href
                ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
        {user && (
          <div className="text-center">
            <span className="block text-sm text-gray-600 dark:text-gray-300">
              {user.email?.split('@')[0] || 'User'}
            </span>
            <span className="block text-xs text-gray-400 dark:text-gray-500">
              {user.email || 'No email available'}
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
