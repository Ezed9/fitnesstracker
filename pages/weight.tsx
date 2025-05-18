import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'

interface WeightLog {
  id: string
  weight: number
  date: string
  note?: string
}

export default function WeightTracking() {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([])
  const [showAddWeight, setShowAddWeight] = useState(false)

  // Calculate stats
  const currentWeight = weightLogs[0]?.weight
  const previousWeight = weightLogs[1]?.weight
  const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : null

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Weight Tracking
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Monitor your body weight progress
            </p>
          </div>
          <button
            onClick={() => setShowAddWeight(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log Weight
          </button>
        </div>

        {/* Weight Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Current Weight
            </h3>
            <div className="mt-2 flex items-baseline">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                {currentWeight ? `${currentWeight} kg` : '--'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Previous Weight
            </h3>
            <div className="mt-2 flex items-baseline">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white">
                {previousWeight ? `${previousWeight} kg` : '--'}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Change</h3>
            <div className="mt-2 flex items-baseline">
              <div
                className={`text-3xl font-semibold ${
                  weightChange === null
                    ? 'text-gray-900 dark:text-white'
                    : weightChange > 0
                    ? 'text-red-600 dark:text-red-400'
                    : weightChange < 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {weightChange === null
                  ? '--'
                  : weightChange === 0
                  ? 'No change'
                  : `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg`}
              </div>
            </div>
          </div>
        </div>

        {/* Weight History */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Weight History
            </h2>
            {weightLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No weight measurements logged yet.
              </p>
            ) : (
              <div className="space-y-4">
                {weightLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {log.weight} kg
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      {log.note && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {log.note}
                        </p>
                      )}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500">Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Weight Modal - We'll implement this later */}
        {showAddWeight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Log Weight
              </h2>
              {/* Add weight form here */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddWeight(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Save Weight
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 