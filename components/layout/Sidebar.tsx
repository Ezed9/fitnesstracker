import { HomeIcon, ChartBarIcon, CogIcon, UserIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Macro Tracker', href: '/macrotracker', icon: ChartBarIcon },
  { name: 'Workout', href: '/workout', icon: PlusCircleIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <h2 className="text-xl font-bold text-gray-900">FitTrack</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">User</p>
              <p className="text-xs font-medium text-gray-500">View profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
