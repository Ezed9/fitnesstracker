import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'

interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MealLog {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

export default function MacroTracking() {
  const [meals, setMeals] = useState<MealLog[]>([])
  const [showAddMeal, setShowAddMeal] = useState(false)
  
  // Example goals - these would typically come from user settings
  const goals: MacroGoals = {
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 70,
  }

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Macro Tracking
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Track your daily nutrition
            </p>
          </div>
          <button
            onClick={() => setShowAddMeal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Meal
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</h3>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totals.calories} / {goals.calories}
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{
                    width: `${Math.min((totals.calories / goals.calories) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</h3>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totals.protein}g / {goals.protein}g
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-green-600 rounded-full"
                  style={{
                    width: `${Math.min((totals.protein / goals.protein) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</h3>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totals.carbs}g / {goals.carbs}g
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min((totals.carbs / goals.carbs) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat</h3>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totals.fat}g / {goals.fat}g
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-yellow-600 rounded-full"
                  style={{
                    width: `${Math.min((totals.fat / goals.fat) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meal List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Today&apos;s Meals
            </h2>
            {meals.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No meals logged yet today.</p>
            ) : (
              <div className="space-y-4">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</p>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs •{' '}
                        {meal.fat}g fat
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500">Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Meal Modal - We'll implement this later */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Meal
              </h2>
              {/* Add meal form here */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
                  Save Meal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 