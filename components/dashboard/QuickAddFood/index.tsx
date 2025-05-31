import React, { useState, useEffect, useRef } from 'react'
import { PlusIcon, SearchIcon, XIcon, Loader2Icon, Clock3Icon, MinusIcon } from 'lucide-react'
import { searchFoodItems, formatFoodData, UnifiedFoodItem } from '@/services/nutritionApi'
import { addFoodLog, FoodLogEntry } from '@/services/supabaseService'
import { toast } from 'react-hot-toast'
import { supabase } from '@/services/supabaseService'

interface FoodItem {
  id?: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  image: string
  servingSize?: string | number
  source?: 'usda' | 'spoonacular'
}

// Define a type that combines our app's FoodItem and the unified API item
type FoodItemInput = FoodItem | UnifiedFoodItem;

type ServingUnit = 'serving' | 'g' | 'oz';

// Fallback common foods in case API is not available
const fallbackFoods: FoodItem[] = [
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, image: '' },
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0, image: '' },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 3, image: '' },
  { name: 'Egg', calories: 78, protein: 6, carbs: 1, fats: 5, image: '' },
  { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3, fats: 0, image: '' },
  { name: 'Oatmeal (100g)', calories: 389, protein: 16, carbs: 66, fats: 7, image: '' },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fats: 13, image: '' },
  { name: 'Avocado (100g)', calories: 160, protein: 2, carbs: 8, fats: 15, image: '' },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fats: 14, image: '' },
]

export const QuickAddFood: React.FC = () => {
  // State for search and results
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UnifiedFoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [apiError, setApiError] = useState(false)

  // State for selected food and serving
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [servingSize, setServingSize] = useState<number>(1)
  const [servingUnit, setServingUnit] = useState<ServingUnit>('serving')
  const [isAddingFood, setIsAddingFood] = useState(false)

  // Legacy state for backward compatibility
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([])
  const [servings, setServings] = useState<Record<string, number>>({})
  
  // UI state
  const [isAdding, setIsAdding] = useState(false)
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle clicks outside of search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for foods using the Nutritionix API with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchFoodItems(query);
        setSearchResults(results);
        setShowResults(true);
        setApiError(false);
        setError(null);
      } catch (error) {
        console.error('Error searching for foods:', error);
        setApiError(true);
        setError('Failed to search for foods. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query])

  // Fallback to static foods if API fails
  const filteredFoods = apiError
    ? fallbackFoods.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Handle selecting a food from search results
  const handleSelectFood = (food: UnifiedFoodItem) => {
    // Save to recent searches if not already there
    if (!recentSearches.includes(query) && query.trim()) {
      const newRecentSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecentSearches);
      // Could also save to localStorage here
    }
    
    // Convert UnifiedFoodItem to our app's FoodItem format
    const formattedFood: FoodItem = {
      id: food.id,
      name: food.name,
      calories: Math.round(food.calories || 0),
      protein: Math.round(food.protein || 0),
      carbs: Math.round(food.carbs || 0),
      fats: Math.round(food.fats || 0),
      image: food.image || '',
      servingSize: typeof food.servingSize === 'number' ? String(food.servingSize) : food.servingSize,
      source: food.source
    };
    
    setSelectedFood(formattedFood);
    setServingSize(1);
    setServingUnit('serving');
    setShowResults(false);
  }
  
  // Quick add a food directly from search
  const handleQuickAdd = () => {
    if (!query.trim()) return;
    
    // Create a simple food item from the search query
    const quickAddFood: FoodItem = {
      name: query,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      image: ''
    };
    
    // Add to selected foods (for backward compatibility)
    setSelectedFoods([...selectedFoods, quickAddFood]);
    setServings({ ...servings, [quickAddFood.name]: 1 });
    
    // Also set as selected food for the new UI
    setSelectedFood(quickAddFood);
    setServingSize(1);
    setServingUnit('serving');
    setQuery('');
    setShowResults(false);
  }
  
  // Legacy handleAddFood for backward compatibility
  const handleAddFood = (food: FoodItemInput) => {
    // If it's a unified food item from API, convert it to our app's format
    if ('source' in food && 'id' in food) {
      // It's a UnifiedFoodItem from the API
      const formattedFood: FoodItem = {
        id: food.id,
        name: `${food.name} (${food.servingSize || 'Standard Serving'})`,
        calories: Math.round(food.calories || 0),
        protein: Math.round(food.protein || 0),
        carbs: Math.round(food.carbs || 0),
        fats: Math.round(food.fats || 0),
        image: food.image || '',
        servingSize: typeof food.servingSize === 'number' ? String(food.servingSize) : food.servingSize,
        source: food.source
      }
      setSelectedFoods([...selectedFoods, formattedFood])
      setServings({ ...servings, [formattedFood.name]: 1 })
    } else {
      // It's already in our app's format
      setSelectedFoods([...selectedFoods, food as FoodItem])
      setServings({ ...servings, [food.name]: 1 })
    }
    setQuery('')
    setIsAdding(false)
    setSearchResults([])
    setShowResults(false)
  }

  // Serving size controls for the new UI
  const incrementServing = () => {
    if (servingUnit === 'serving') {
      setServingSize(prev => prev + 1);
    } else {
      setServingSize(prev => prev + 5);
    }
  }

  const decrementServing = () => {
    if (servingUnit === 'serving') {
      setServingSize(prev => Math.max(0.25, prev - 1));
    } else {
      setServingSize(prev => Math.max(5, prev - 5));
    }
  }
  
  // Legacy functions for backward compatibility
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

  // Add a single food from the new UI
  const handleAddSingleFood = async () => {
    console.log('handleAddSingleFood called');
    if (!selectedFood) {
      console.error('No food selected');
      toast.error('Please select a food first');
      return;
    }
    
    try {
      setIsAddingFood(true);
      console.log('Setting isAddingFood to true');
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Format serving size text based on unit
      let servingSizeText = `${servingSize} `;
      if (servingUnit === 'serving') {
        servingSizeText += `serving${servingSize !== 1 ? 's' : ''}`;
      } else {
        servingSizeText += servingUnit;
      }
      
      // Format the food log entry for Supabase
      const notes = `Quick added with ${servingSizeText}`;
      const foodLog: FoodLogEntry = {
        log_date: today,
        meal_type: 'snacks', // Always set to snacks for quick add
        servings: servingSize,
        serving_size: servingSizeText,
        calories: Math.round((selectedFood.calories || 0) * servingSize),
        protein: Math.round((selectedFood.protein || 0) * servingSize),
        carbs: Math.round((selectedFood.carbs || 0) * servingSize),
        fats: Math.round((selectedFood.fats || 0) * servingSize),
        food_name: selectedFood.name,
        image_url: selectedFood.image || '',
        log_time: new Date().toTimeString().substring(0, 5),
        notes: notes,
        food_item_id: null // Set to null for manually added items
      };
      
      console.log('Adding food log:', {
        ...foodLog,
        notes: notes.length > 50 ? notes.substring(0, 50) + '...' : notes
      });
      
      // Save to Supabase - explicitly pass supabase client to ensure it's used
      const id = await addFoodLog(foodLog, supabase);
      if (!id) {
        console.error('Failed to add food log for:', selectedFood.name);
        throw new Error(`Failed to add food log for: ${selectedFood.name}`);
      }
      
      console.log('Successfully added food log with ID:', id);
      toast.success(`Added ${selectedFood.name} to snacks!`);
      
      // Clear selection
      setSelectedFood(null);
      setServingSize(1);
      setServingUnit('serving');
      
      // Dispatch event to update UI
      dispatchFoodLogsUpdatedEvent();
      
    } catch (error: any) {
      console.error('Error adding food:', error);
      toast.error(error.message || 'Failed to add food to snacks. Please try again.');
    } finally {
      setIsAddingFood(false);
    }
  };
  
  // Helper function to dispatch the food logs updated event
  const dispatchFoodLogsUpdatedEvent = () => {
    console.log('Dispatching foodLogsUpdated event');
    try {
      const event = new CustomEvent('foodLogsUpdated', { 
        detail: { 
          mealType: 'snacks',
          timestamp: new Date().toISOString()
        } 
      });
      window.dispatchEvent(event);
      console.log('First event dispatched successfully');
      
      // Also trigger a manual refresh after a short delay to ensure data consistency
      setTimeout(() => {
        console.log('Triggering manual refresh of food logs');
        try {
          window.dispatchEvent(new CustomEvent('foodLogsUpdated', { 
            detail: { 
              mealType: 'snacks',
              timestamp: new Date().toISOString(),
              source: 'manual-refresh'
            } 
          }));
          console.log('Second event dispatched successfully');
        } catch (error) {
          console.error('Error dispatching second event:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error dispatching event:', error);
    }
  };
  
  // Legacy function for backward compatibility
  const handleLogFoods = async () => {
    console.log('Starting handleLogFoods with selected foods:', selectedFoods);
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Create a loading state
      setLoading(true);
      
      // Log each food to Supabase
      const foodLogPromises = selectedFoods.map(async (food) => {
        const foodServings = servings[food.name] || 1;
        
        // Format the food log entry for Supabase
        const notes = `Quick added with ${foodServings} serving${foodServings !== 1 ? 's' : ''}`;
        const foodLog: FoodLogEntry = {
          log_date: today,
          meal_type: 'snacks', // Always set to snacks for quick add
          servings: foodServings,
          serving_size: `${foodServings} serving${foodServings !== 1 ? 's' : ''}`,
          calories: Math.round(food.calories * foodServings),
          protein: Math.round(food.protein * foodServings),
          carbs: Math.round(food.carbs * foodServings),
          fats: Math.round(food.fats * foodServings),
          food_name: food.name,
          image_url: food.image || '',
          log_time: new Date().toTimeString().substring(0, 5),
          notes: notes, // Ensure notes is always defined
          food_item_id: null // Set to null for manually added items
        };
        
        console.log('Adding food log:', {
          ...foodLog,
          notes: notes.length > 50 ? notes.substring(0, 50) + '...' : notes
        });
        
        // Save to Supabase - explicitly pass supabase client to ensure it's used
        try {
          const id = await addFoodLog(foodLog, supabase);
          if (!id) {
            console.error('Failed to add food log for:', food.name);
            throw new Error(`Failed to add food log for: ${food.name}`);
          }
          console.log('Successfully added food log with ID:', id);
          return id;
        } catch (error) {
          console.error(`Error adding food log for ${food.name}:`, error);
          throw error; // Re-throw to be caught by the outer catch
        }
      });
      
      // Wait for all food logs to be added
      await Promise.all(foodLogPromises);
      
      console.log('Successfully logged all foods to snacks');
      toast.success('Foods added to snacks successfully!');
      
      // Clear selections after logging
      setSelectedFoods([]);
      setServings({});
      
      // Dispatch event to update UI
      dispatchFoodLogsUpdatedEvent();
      
    } catch (error) {
      console.error('Error in handleLogFoods:', error);
      toast.error('Failed to add foods to snacks. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const totals = getTotalNutrients()

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Quick Add Food</h3>
        {selectedFoods.length > 0 && (
          <button
            onClick={handleLogFoods}
            disabled={loading}
            className="px-3 py-1 bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-md text-sm font-medium flex items-center transition-all"
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              'Log Foods'
            )}
          </button>
        )}
      </div>

      <div className="mt-4 relative" ref={searchRef}>
        {!selectedFood ? (
          // Search interface
          <>
            {/* Search Input */}
            <div className="relative mb-3">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setShowResults(true)}
                placeholder="Search foods for snacks..."
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
            {showResults && searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto bg-[#252525] rounded-lg">
                {searchResults.map((food) => (
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
            
            {/* No Results */}
            {showResults && query && searchResults.length === 0 && !loading && (
              <div className="mt-2 bg-[#252525] rounded-lg p-4 text-center">
                <p className="text-gray-400">No foods found. Try a different search term.</p>
                <button 
                  onClick={handleQuickAdd}
                  className="mt-2 bg-[#4ADE80] hover:bg-green-500 text-black text-sm font-medium py-1 px-3 rounded-lg"
                >
                  Quick Add "{query}" to snacks
                </button>
              </div>
            )}

            {/* Fallback Foods */}
            {apiError && query && (
              <div className="mt-2 max-h-60 overflow-y-auto bg-[#252525] rounded-lg">
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

            {/* Legacy Selected Foods */}
            {selectedFoods.length > 0 && (
              <>
                <div className="space-y-3 mb-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-300">Selected Foods</h4>
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
                
                {/* Log to Snacks button */}
                <button
                  onClick={handleLogFoods}
                  disabled={loading}
                  className="w-full mt-4 bg-[#4ADE80] hover:bg-[#22C55E] text-black font-medium py-2 rounded-lg flex items-center justify-center transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
                      Saving to Snacks...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Log Foods to Snacks
                    </>
                  )}
                </button>
              </>
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
                    🍎
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-lg">{selectedFood.name}</div>
                <div className="text-sm text-gray-400">
                  {selectedFood.servingSize || 'Standard Serving'}
                  {selectedFood.source && (
                    <span className="ml-2 px-1.5 py-0.5 bg-gray-700 text-xs rounded">
                      From {selectedFood.source === 'usda' ? 'USDA' : 'Spoonacular'}
                    </span>
                  )}
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
                  onChange={(e) => setServingUnit(e.target.value as ServingUnit)}
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
                onClick={() => {
                  console.log('Add to Snacks button clicked');
                  console.log('Selected food:', selectedFood);
                  handleAddSingleFood();
                }}
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
                    Add to Snacks
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickAddFood
