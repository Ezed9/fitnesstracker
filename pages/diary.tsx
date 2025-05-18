import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'

interface Exercise {
  id: string
  name: string
  sets: {
    weight: number
    reps: number
  }[]
}

interface WorkoutLog {
  id: string
  date: string
  exercises: Exercise[]
}

export default function WorkoutDiary() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [showNewWorkout, setShowNewWorkout] = useState(false)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Workout Diary
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Track your workouts and progress
            </p>
          </div>
          <button
            onClick={() => setShowNewWorkout(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Workout
          </button>
        </div>

        {/* Workout List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          {workoutLogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No workouts logged yet. Start by adding a new workout!
            </div>
          ) : (
            workoutLogs.map((log) => (
              <div key={log.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Workout on {new Date(log.date).toLocaleDateString()}
                    </h3>
                    <div className="mt-2 space-y-4">
                      {log.exercises.map((exercise) => (
                        <div key={exercise.id} className="pl-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {exercise.name}
                          </h4>
                          <div className="mt-1 space-y-1">
                            {exercise.sets.map((set, index) => (
                              <p
                                key={index}
                                className="text-sm text-gray-600 dark:text-gray-400"
                              >
                                Set {index + 1}: {set.weight}kg × {set.reps} reps
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-500">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Workout Modal - We'll implement this later */}
        {showNewWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                New Workout
              </h2>
              {/* Add workout form here */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewWorkout(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Save Workout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 