import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month')

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Track your progress over time
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeframe === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeframe === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeframe === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Progress Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Weight Progress
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart will be implemented here
            </div>
          </div>

          {/* Workout Volume Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Workout Volume
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart will be implemented here
            </div>
          </div>

          {/* Macro Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Macro Distribution
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart will be implemented here
            </div>
          </div>

          {/* Workout Frequency Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Workout Frequency
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Chart will be implemented here
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Workouts
            </h3>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">0</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">This {timeframe}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Weight Change
            </h3>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                0 kg
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">This {timeframe}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg. Calories
            </h3>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                0 kcal
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Per day</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Goal Progress
            </h3>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">0%</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completion</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 