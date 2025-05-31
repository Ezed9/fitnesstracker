import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, SearchIcon, Loader2Icon, XIcon, MinusIcon, CheckIcon, Clock3Icon } from 'lucide-react';
import { searchFoodItems, formatFoodData, UnifiedFoodItem } from '@/services/nutritionApi';
import { SupabaseClient } from '@supabase/supabase-js';

// We'll use a standard serving size for calculations
type ExtendedFoodItem = UnifiedFoodItem;

// Define valid meal types
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface FoodSearchProps {
  onAddFood: (food: any) => void;
  defaultMealType?: MealType;
  supabase: SupabaseClient;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onAddFood, defaultMealType = 'breakfast', supabase }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnifiedFoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [selectedMealType, setSelectedMealType] = useState<MealType>(defaultMealType)
  const [selectedFood, setSelectedFood] = useState<ExtendedFoodItem | null>(null)
  const [servingSize, setServingSize] = useState<number>(1)
  const [servingUnit, setServingUnit] = useState<'g' | 'oz' | 'serving'>('serving')
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

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

  const handleSelectFood = (food: UnifiedFoodItem) => {
    // Use the food item as is
    setSelectedFood(food)
    setShowResults(false)
  }

  const handleAddFood = async () => {
    if (!selectedFood) return
    
    setIsAddingFood(true)
    
    try {
      let multiplier = servingSize
      if (servingUnit === 'g') {
        multiplier = servingSize / 100
      } else if (servingUnit === 'oz') {
        multiplier = (servingSize * 28.35) / 100
      }
      
      // Format the serving size string with proper units
      let servingSizeStr = ''
      if (servingUnit === 'g') {
        servingSizeStr = `${servingSize}g`
      } else if (servingUnit === 'oz') {
        servingSizeStr = `${servingSize}oz`
      } else {
        servingSizeStr = `${servingSize} serving${servingSize !== 1 ? 's' : ''}`
      }
      
      // Validate meal type before using it
      const validMealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks']
      let mealType = selectedMealType
      
      if (!validMealTypes.includes(mealType)) {
        console.warn(`Invalid meal type: ${mealType}, defaulting to 'snacks'`)
        mealType = 'snacks'
      }
      
      console.log('Selected meal type before adding food:', mealType)
      
      const formattedFood = {
        ...formatFoodData(selectedFood),
        calories: Math.round((selectedFood.calories || 0) * multiplier),
        protein: Math.round((selectedFood.protein || 0) * multiplier),
        carbs: Math.round((selectedFood.carbs || 0) * multiplier),
        fats: Math.round((selectedFood.fats || 0) * multiplier),
        mealType: mealType, // Use validated meal type
        servingSize: servingSizeStr
      }
      
      // Log the formatted food to help with debugging
      console.log('Adding food with details:', {
        name: formattedFood.name,
        mealType: formattedFood.mealType,
        servingSize: servingSizeStr,
        calories: formattedFood.calories
      })
      
      // Save the search term to recent searches if it's not already there
      if (query.trim() && !recentSearches.includes(query.trim())) {
        // Keep only the most recent 5 searches
        const updatedSearches = [query.trim(), ...recentSearches].slice(0, 5)
        setRecentSearches(updatedSearches)
        // Could also save to localStorage here for persistence
      }
      
      await onAddFood(formattedFood)
      
      setSelectedFood(null)
      setServingSize(1)
      setServingUnit('serving')
      setQuery('')
    } catch (error) {
      console.error('Error adding food:', error)
    } finally {
      setIsAddingFood(false)
    }
  }
  
  const incrementServing = () => {
    setServingSize(prev => Math.min(prev + (servingUnit === 'serving' ? 1 : 5), 1000))
  }
  
  const decrementServing = () => {
    setServingSize(prev => Math.max(prev - (servingUnit === 'serving' ? 1 : 5), 0.1))
  }

  // Define meal types with icons and colors
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🍳', color: 'bg-yellow-500' },
    { value: 'lunch', label: 'Lunch', icon: '🥗', color: 'bg-green-500' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️', color: 'bg-purple-500' },
    { value: 'snacks', label: 'Snacks', icon: '🍎', color: 'bg-red-500' },
  ]

  // Quick Add function to add custom food items directly
  const handleQuickAdd = async () => {
    if (!query.trim()) return;
    
    setIsAddingFood(true);
    
    try {
      // Create a custom food item based on the query
      const customFood: UnifiedFoodItem = {
        id: `custom-${Date.now()}`,
        name: query.trim(),
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        servingSize: '1 serving',
        source: 'usda' // Using 'usda' as the source type since 'custom' is not a valid source type
      };
      
      // Set as selected food to allow user to customize nutrition values
      setSelectedFood(customFood);
      setShowResults(false);
      
      // Save to recent searches
      if (!recentSearches.includes(query.trim())) {
        const updatedSearches = [query.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(updatedSearches);
      }
    } catch (error) {
      console.error('Error with quick add:', error);
    } finally {
      setIsAddingFood(false);
    }
  }
  
  return (
    <div className="mt-4 relative" ref={searchRef}>
      {!selectedFood ? (
        // Search interface
        <>
          {/* Meal Type Selection Tabs */}
          <div className="flex mb-4 bg-[#252525] p-1 rounded-lg">
            {mealTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  console.log('Meal type changed to:', type.value);
                  setSelectedMealType(type.value as MealType);
                }}
                className={`flex items-center justify-center flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${selectedMealType === type.value ? `${type.color} text-black` : 'text-gray-400 hover:bg-[#2A2A2A]'}`}
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setShowResults(true)}
              placeholder={`Search foods for ${mealTypes.find(t => t.value === selectedMealType)?.label}...`}
              className="w-full pl-10 pr-4 py-2 bg-[#252525] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4ADE80] text-white"
              autoFocus
            />
            {loading ? (
              <Loader2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            ) : null}
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2 flex items-center">
                <Clock3Icon className="w-3 h-3 mr-1" /> Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(term)}
                    className="text-xs bg-[#1E1E1E] hover:bg-gray-700 text-gray-300 py-1 px-2 rounded-md flex items-center"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Search Results */}
          {showResults && results.length > 0 && (
            <div className="mt-2 max-h-60 overflow-y-auto bg-[#252525] rounded-lg">
              {results.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleSelectFood(food)}
                  className="px-4 py-2 hover:bg-[#2A2A2A] cursor-pointer flex items-center"
                >
                  {food.image && (
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-xs text-gray-400">
                      {food.servingSize || 'Standard Serving'}
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-700 text-xs rounded">
                        From {food.source === 'usda' ? 'USDA' : 'Spoonacular'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 ml-2">{Math.round(food.calories)} kcal</span>
                </div>
              ))}
            </div>
          )}
          {showResults && query && results.length === 0 && !loading && (
            <div className="mt-2 bg-[#252525] rounded-lg p-4 text-center">
              <p className="text-gray-400">No foods found. Try a different search term.</p>
              <button 
                onClick={handleQuickAdd}
                className="mt-2 bg-[#4ADE80] hover:bg-green-500 text-black text-sm font-medium py-1 px-3 rounded-lg"
              >
                Quick Add "{query}" to {selectedMealType}
              </button>
            </div>
          )}
        </>
      ) : (
        // Serving size selection interface
        <div className="bg-[#252525] rounded-lg p-4">
          {/* Header with food info */}
          <div className="flex items-start mb-4">
            <div className="flex-grow-0 flex-shrink-0 mr-3">
              {selectedFood.image ? (
                <img 
                  src={selectedFood.image} 
                  alt={selectedFood.name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-2xl">
                  {mealTypes.find(t => t.value === selectedMealType)?.icon}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-lg">{selectedFood.name}</div>
              <div className="text-sm text-gray-400">
                {selectedFood.servingSize || 'Standard Serving'}
                <span className="ml-2 px-1.5 py-0.5 bg-gray-700 text-xs rounded">
                  From {selectedFood.source === 'usda' ? 'USDA' : 'Spoonacular'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFood(null)}
              className="text-gray-400 hover:text-white"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Nutrition info */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Nutrition per serving:</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">Calories: {Math.round(selectedFood.calories || 0)}</div>
              <div className="text-sm">Protein: {Math.round(selectedFood.protein || 0)}g</div>
              <div className="text-sm">Carbs: {Math.round(selectedFood.carbs || 0)}g</div>
              <div className="text-sm">Fat: {Math.round(selectedFood.fats || 0)}g</div>
            </div>
          </div>
          
          {/* Meal type selection */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Add to meal:</label>
            <div className="flex bg-[#1E1E1E] p-1 rounded-lg">
              {mealTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedMealType(type.value as MealType)}
                  className={`flex items-center justify-center flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${selectedMealType === type.value ? `${type.color} text-black` : 'text-gray-400 hover:bg-gray-800'}`}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Serving controls */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount</label>
              <div className="flex items-center">
                <button 
                  onClick={decrementServing}
                  className="bg-[#252525] rounded-l-lg p-2 hover:bg-[#2A2A2A]"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <input 
                  type="number" 
                  value={servingSize}
                  onChange={(e) => setServingSize(parseFloat(e.target.value) || 1)}
                  className="w-full bg-[#252525] py-2 px-3 text-center focus:outline-none"
                  min="0.1"
                  step={servingUnit === 'serving' ? 1 : 5}
                />
                <button 
                  onClick={incrementServing}
                  className="bg-[#252525] rounded-r-lg p-2 hover:bg-[#2A2A2A]"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Unit</label>
              <select
                value={servingUnit}
                onChange={(e) => setServingUnit(e.target.value as 'g' | 'oz' | 'serving')}
                className="w-full bg-[#252525] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
              >
                <option value="serving">Serving</option>
                <option value="g">Grams (g)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>
          </div>
          
          {/* Add button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Total calories: <span className="text-white font-medium">{Math.round((selectedFood.calories || 0) * servingSize)}</span>
            </div>
            <button 
              onClick={handleAddFood}
              disabled={isAddingFood}
              className="w-full sm:w-auto bg-[#4ADE80] hover:bg-green-500 text-black font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              {isAddingFood ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add to {mealTypes.find(t => t.value === selectedMealType)?.label}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodSearch
