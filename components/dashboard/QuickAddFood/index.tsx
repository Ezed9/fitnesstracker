import React, { useState } from 'react'
import { PlusIcon, SearchIcon, XIcon } from 'lucide-react'

interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

const commonFoods: FoodItem[] = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Brown Rice (100g)', calories: 112, protein: 2.6, carbs: 23, fats: 0.9 },
  { name: 'Egg (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fats: 5 },
  { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13 },
  { name: 'Avocado (1/2)', calories: 161, protein: 2, carbs: 8.6, fats: 15 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fats: 14 },
]

export const QuickAddFood: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [servings, setServings] = useState<{ [key: string]: number }>({})
  const [isAdding, setIsAdding] = useState(false)

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food])
    setServings({ ...servings, [food.name]: 1 })
    setSearchTerm('')
    setIsAdding(false)
  }

  const handleRemoveFood = (foodName: string) => {
    setSelectedFoods(selectedFoods.filter(food => food.name !== foodName))
    const newServings = { ...servings }
    delete newServings[foodName]
    setServings(newServings)
  }

  const handleServingChange = (foodName: string, value: number) => {
    setServings({ ...servings, [foodName]: value })
  }

  const getTotalNutrients = () => {
    return selectedFoods.reduce(
      (acc, food) => {
        const servingMultiplier = servings[food.name] || 1
        return {
          calories: acc.calories + food.calories * servingMultiplier,
          protein: acc.protein + food.protein * servingMultiplier,
          carbs: acc.carbs + food.carbs * servingMultiplier,
          fats: acc.fats + food.fats * servingMultiplier,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )
  }

  const handleLogFoods = () => {
    // In a real app, this would send the data to an API
    console.log('Logging foods:', selectedFoods.map(food => ({
      ...food,
      servings: servings[food.name] || 1
    })))
    
    // Clear selections after logging
    setSelectedFoods([])
    setServings({})
  }

  const totals = getTotalNutrients()

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Quick Add Food</h3>
        {selectedFoods.length > 0 && (
          <button 
            onClick={handleLogFoods}
            className="px-3 py-1 bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-md text-sm font-medium"
          >
            Log Foods
          </button>
        )}
      </div>

      {/* Search or Add Food */}
      {!isAdding ? (
        <div className="mb-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#252525] hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4 text-[#4ADE80]" />
            <span>Add Food</span>
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search common foods..."
              className="w-full pl-10 pr-4 py-2 bg-[#252525] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4ADE80] text-white"
              autoFocus
            />
            <button 
              onClick={() => setIsAdding(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {searchTerm && (
            <div className="mt-2 max-h-48 overflow-y-auto bg-[#252525] rounded-lg">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <div
                    key={food.name}
                    onClick={() => handleAddFood(food)}
                    className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer flex justify-between items-center"
                  >
                    <span>{food.name}</span>
                    <span className="text-sm text-gray-400">{food.calories} kcal</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">No foods found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Selected Foods */}
      {selectedFoods.length > 0 && (
        <>
          <div className="space-y-3 mb-4">
            {selectedFoods.map((food) => (
              <div key={food.name} className="flex items-center justify-between bg-[#252525] p-3 rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{food.name}</span>
                    <button 
                      onClick={() => handleRemoveFood(food.name)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {Math.round(food.calories * (servings[food.name] || 1))} kcal • 
                    P: {Math.round(food.protein * (servings[food.name] || 1))}g • 
                    C: {Math.round(food.carbs * (servings[food.name] || 1))}g • 
                    F: {Math.round(food.fats * (servings[food.name] || 1))}g
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <span className="text-sm mr-2">Servings:</span>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={servings[food.name] || 1}
                    onChange={(e) => handleServingChange(food.name, parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 bg-[#1A1A1A] rounded text-center"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-[#252525] p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-medium">{Math.round(totals.calories)} kcal</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <div>
                <span className="text-[#60A5FA]">Protein:</span> {Math.round(totals.protein)}g
              </div>
              <div>
                <span className="text-[#F472B6]">Carbs:</span> {Math.round(totals.carbs)}g
              </div>
              <div>
                <span className="text-[#FB923C]">Fats:</span> {Math.round(totals.fats)}g
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default QuickAddFood
