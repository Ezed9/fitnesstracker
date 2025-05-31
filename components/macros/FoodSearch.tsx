import React, { useState, useEffect, useRef } from 'react'
import { SearchIcon, Loader2Icon, XIcon, PlusIcon } from 'lucide-react'
import { searchFoodItems, FoodItem, formatFoodData } from '@/services/nutritionApi'

interface FoodSearchProps {
  onAddFood: (food: any) => void
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onAddFood }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('snacks')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const foods = await searchFoodItems(query)
        setResults(foods)
        setShowResults(true)
      } catch (err) {
        setError('Failed to search foods. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleAddFood = (food: FoodItem) => {
    const formattedFood = {
      ...formatFoodData(food),
      mealType: selectedMealType
    }
    onAddFood(formattedFood)
    setQuery('')
    setShowResults(false)
  }

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
  ]

  return (
    <div className="mt-4 relative" ref={searchRef}>
      <div className="flex space-x-2 mb-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setShowResults(true)}
              placeholder="Search foods..."
              className="w-full px-4 py-3 pl-10 bg-[#1E1E1E] border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
            />
            {loading ? (
              <Loader2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            ) : (
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            )}
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <select
          value={selectedMealType}
          onChange={(e) => setSelectedMealType(e.target.value as any)}
          className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
        >
          {mealTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#252525] border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((food) => (
            <div 
              key={food.foodId}
              className="p-3 border-b border-gray-700 hover:bg-[#333333] cursor-pointer flex items-start"
              onClick={() => handleAddFood(food)}
            >
              <div className="flex-1">
                <div className="font-medium">{food.label}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {Math.round(food.nutrients.ENERC_KCAL || 0)} kcal • 
                  P: {Math.round(food.nutrients.PROCNT || 0)}g • 
                  C: {Math.round(food.nutrients.CHOCDF || 0)}g • 
                  F: {Math.round(food.nutrients.FAT || 0)}g
                </div>
              </div>
              <button className="ml-2 p-1 bg-[#4ADE80] rounded-full text-black">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showResults && query && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-[#252525] border border-gray-700 rounded-lg shadow-lg p-4 text-center">
          No foods found. Try a different search term.
        </div>
      )}
    </div>
  )
}

export default FoodSearch
