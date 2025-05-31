import React from 'react'
import { Trash2Icon, PlusIcon } from 'lucide-react'
interface FoodItem {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
}
interface FoodLogProps {
  foodItems: FoodItem[]
  onRemoveFood?: (id: number) => void
}
const MealSection: React.FC<{
  title: string
  items: FoodItem[]
  onRemoveFood?: (id: number) => void
}> = ({ title, items, onRemoveFood }) => {
  if (items.length === 0) return null
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white capitalize">{title}</h3>
        <button className="text-[#4ADE80] hover:text-green-400 flex items-center text-sm">
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Food
        </button>
      </div>
      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#252525] rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-400">{item.time}</p>
              </div>
              <button 
                onClick={() => onRemoveFood && onRemoveFood(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Calories: </span>
                <span>{item.calories}</span>
              </div>
              <div>
                <span className="text-gray-400">Protein: </span>
                <span>{item.protein}g</span>
              </div>
              <div>
                <span className="text-gray-400">Carbs: </span>
                <span>{item.carbs}g</span>
              </div>
              <div>
                <span className="text-gray-400">Fat: </span>
                <span>{item.fat}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop View - Table */}
      <div className="hidden md:block bg-[#1E1E1E] rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Food
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Calories
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Protein
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Carbs
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Fat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Time
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{item.calories}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{item.protein}g</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{item.carbs}g</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{item.fat}g</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{item.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onRemoveFood && onRemoveFood(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export const FoodLog: React.FC<FoodLogProps> = ({ foodItems, onRemoveFood }) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const
  const foodByMeal = mealTypes.reduce(
    (acc, mealType) => {
      acc[mealType] = foodItems.filter((item) => item.mealType === mealType)
      return acc
    },
    {} as Record<(typeof mealTypes)[number], FoodItem[]>,
  )
  return (
    <div>
      {mealTypes.map((mealType) => (
        <MealSection
          key={mealType}
          title={mealType}
          items={foodByMeal[mealType]}
          onRemoveFood={onRemoveFood}
        />
      ))}
    </div>
  )
}
