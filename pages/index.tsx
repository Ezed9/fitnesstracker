import { Layout } from '@/components/layout/Layout'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Here&apos;s an overview of your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Workout Summary Card */}
          <Link href="/diary" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Workouts</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">0</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">workouts this week</p>
            </div>
          </Link>

          {/* Macro Tracking Card */}
          <Link href="/macros" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calories</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">0</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">kcal today</p>
            </div>
          </Link>

          {/* Weight Tracking Card */}
          <Link href="/weight" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weight</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">--</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">current weight</p>
            </div>
          </Link>

          {/* Analytics Card */}
          <Link href="/analytics" className="block">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Progress</h3>
              <p className="mt-2 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">View</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">detailed analytics</p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Log Workout
            </button>
            <button className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Track Meal
            </button>
            <button className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Update Weight
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
