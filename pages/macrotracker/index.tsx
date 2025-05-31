import React, { useState, useEffect, useCallback } from 'react';
import { CalendarIcon, PlusCircleIcon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import AuthWrapper from '@/components/AuthWrapper/index';
import { DailySummary } from '@/components/macros/DailySummary';
import { GoalBreakdown } from '@/components/macros/GoalBreakdown';
import { FoodLog } from '@/components/macros/FoodLog';
import { Header } from '@/components/macros/Header';
import { MotivationalText } from '@/components/macros/MotivationalText';
import FoodSearch from '@/components/macros/FoodSearch';
import { 
  getUserMacroGoals, 
  getFoodLogs, 
  addFoodLog, 
  removeFoodLog, 
  saveFoodItem,
  FoodLogEntry, 
  MacroGoals 
} from '@/services/supabaseService';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  servingSize?: string;
}

interface MacroTrackerProps {
  supabase: SupabaseClient;
}

const MacroTracker: React.FC<MacroTrackerProps> = ({ supabase }) => {
  // Debug: Check if Supabase client is properly initialized
  console.log('Supabase client in MacroTracker:', supabase ? 'Initialized' : 'Missing');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  const [date, setDate] = useState(new Date())
  const [foodLogs, setFoodLogs] = useState<Record<string, FoodLogEntry[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingFood, setIsAddingFood] = useState<boolean>(false);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('snacks')
  
  // Daily goals for the tracker
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  })
  
  // State for food items and consumed macros
  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  // Format date for API calls
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Load food logs when date changes
  const fetchFoodLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Fetching food logs for date:', formattedDate);
      
      const logs: FoodLogEntry[] = await getFoodLogs(formattedDate, supabase);
      
      // Transform logs to match the FoodLogEntry type
      const transformedLogs: FoodLogEntry[] = logs.map(log => ({
        id: log.id || '',
        user_id: log.user_id || '',
        food_item_id: log.food_item_id || null,
        log_date: log.log_date || formattedDate,
        meal_type: log.meal_type || 'snacks',
        servings: log.servings || 1,
        calories: log.calories || 0,
        protein: log.protein || 0,
        carbs: log.carbs || 0,
        fats: log.fats || 0,
        food_name: log.food_name || 'Unknown Food',
        log_time: log.log_time || new Date().toISOString(),
        notes: log.notes || '',
        serving_size: log.serving_size || '1 serving',
        created_at: log.created_at || new Date().toISOString()
      }));
      
      // Group logs by meal type
      const logsByMealType: Record<string, FoodLogEntry[]> = {};
      transformedLogs.forEach(log => {
        if (!logsByMealType[log.meal_type]) {
          logsByMealType[log.meal_type] = [];
        }
        logsByMealType[log.meal_type].push(log);
      });
      
      setFoodLogs(logsByMealType);
      console.log('Updated foodLogs state with new data:', logsByMealType);
      
    } catch (error) {
      console.error('Error fetching food logs:', error);
      toast.error('Failed to load food logs');
    } finally {
      setIsLoading(false);
    }
  }, [date, supabase]);

  useEffect(() => {
    fetchFoodLogs();
  }, [fetchFoodLogs]);
  
  // Listen for food log updates from other components (like QuickAddFood)
  useEffect(() => {
    const handleFoodLogsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const source = customEvent.detail?.source || 'unknown';
      const timestamp = customEvent.detail?.timestamp || 'unknown';
      
      console.log(`[${new Date().toISOString()}] Received foodLogsUpdated event`, {
        source,
        timestamp,
        currentMealType: activeMealType
      });
      
      // Force a refresh of the food logs
      fetchFoodLogs().then(() => {
        console.log('Successfully refreshed food logs after update');
      }).catch(error => {
        console.error('Error refreshing food logs after update:', error);
      });
    };
    
    // Add the event listener
    window.addEventListener('foodLogsUpdated', handleFoodLogsUpdated as EventListener);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('foodLogsUpdated', handleFoodLogsUpdated as EventListener);
    };
  }, [fetchFoodLogs, activeMealType]);

  // Handle adding a new food item
  const handleAddFood = async (food: any) => {
    if (isAddingFood) return; // Prevent multiple submissions
    
    console.log('Starting handleAddFood with food:', {
      ...food,
      // Don't log the entire image if it's too large
      image: food.image_url ? '[image data]' : undefined
    });
    
    setIsAddingFood(true);
    
    try {
      // Prepare the food log data first
      const foodLogData: Omit<FoodLogEntry, 'id' | 'created_at' | 'user_id'> = {
        food_name: food.name || 'Unknown Food',
        meal_type: food.mealType || 'snacks',
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fats: food.fat || 0,
        servings: 1,
        serving_size: food.servingSize || '1 serving',
        notes: `Added with ${food.servingSize || '1 serving'}`,
        log_date: formatDateForAPI(date),
        log_time: new Date().toISOString().substring(11, 16), // Format as HH:MM
        food_item_id: null,
        image_url: food.image_url || null
      };
      
      // Ensure notes is defined
      const notes = foodLogData.notes || '';
      
      console.log('Prepared food log data:', foodLogData);
      
      // Only try to save the food item if we have enough information
      if (food.name && (food.source_id || food.id)) {
        console.log('Saving food item first...');
        try {
          const savedFoodItem = await saveFoodItem({
            name: food.name,
            calories: food.calories || 0,
            protein: food.protein || 0,
            carbs: food.carbs || 0,
            fats: food.fat || 0,
            image_url: food.image_url || '',
            source: food.source || 'user_created',
            source_id: food.source_id || (typeof food.id === 'string' ? food.id : undefined),
            ...(food.servingSize && { serving_size: food.servingSize })
          }, supabase);
          
          if (savedFoodItem) {
            console.log('Saved food item with ID:', savedFoodItem);
            foodLogData.food_item_id = savedFoodItem;
          }
        } catch (error) {
          console.error('Error saving food item (continuing without it):', error);
          // Continue without the food item ID
        }
      }

      console.log('Adding food log with data:', {
        ...foodLogData,
        // Don't log the entire notes if it's too long
        notes: notes.length > 50 
          ? `${notes.substring(0, 50)}...` 
          : notes
      });
      
      const logId = await addFoodLog(foodLogData, supabase);
      
      if (!logId) {
        throw new Error('Failed to add food log');
      }
      
      // Create the new food log entry
      const newFoodLog: FoodLogEntry = {
        ...foodLogData,
        id: logId,
        user_id: '', // This will be set by the server
        created_at: new Date().toISOString()
      };
      
      // Update the UI optimistically
      setFoodLogs(prevLogs => ({
        ...prevLogs,
        [foodLogData.meal_type]: [
          ...(prevLogs[foodLogData.meal_type] || []),
          newFoodLog
        ]
      }));
      
      // Show success message
      toast.success('Food item added successfully!');
      
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item. Please try again.');
      
      // Re-fetch the latest data to ensure consistency
      await fetchFoodLogs();
    } finally {
      setIsAddingFood(false);
    }
  };

  // Handle initiating food search with a specific meal type
  const handleAddFoodToMeal = (mealType: string) => {
    console.log(`Opening food search for meal type: ${mealType}`);
    // This will be passed to the FoodSearch component
    // The FoodSearch component will then initialize with this meal type selected
    setActiveMealType(mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks');
    // Scroll to the food search section
    const foodSearchElement = document.getElementById('food-search-section');
    if (foodSearchElement) {
      foodSearchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle removing a food item
  const handleRemoveFood = async (id: string, mealType: string) => {
    try {
      console.log('Removing food item with ID:', id);
      
      // Remove from database
      await removeFoodLog(id, supabase);
      
      // Optimistically update the UI
      setFoodLogs(prevLogs => {
        const updatedLogs = { ...prevLogs };
        if (updatedLogs[mealType]) {
          updatedLogs[mealType] = updatedLogs[mealType].filter(item => item.id !== id);
        }
        return updatedLogs;
      });
      
      toast.success('Food item removed successfully!');
      
      // Re-fetch to ensure consistency
      await fetchFoodLogs();
    } catch (error) {
      console.error('Error removing food:', error);
      toast.error('Failed to remove food item');
    }
  };
  
  // Calculate total number of food items across all meal types
  const totalFoodItems = Object.values(foodLogs).reduce(
    (total, logs) => total + (logs?.length || 0), 0
  );

  // Update consumed macros whenever foodLogs changes
  useEffect(() => {
    const calculateConsumed = () => {
      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      Object.values(foodLogs).flat().forEach(log => {
        if (log) {
          const servings = log.servings || 1;
          totals.calories += (log.calories || 0) * servings;
          totals.protein += (log.protein || 0) * servings;
          totals.carbs += (log.carbs || 0) * servings;
          totals.fat += (log.fats || 0) * servings;
        }
      });

      setConsumed(totals);
    };

    calculateConsumed();
  }, [foodLogs]);

  return (
    <AuthWrapper>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Header date={date} setDate={setDate} />
          <MotivationalText consumed={consumed} goals={dailyGoals} />
          <div className="mt-6">
            <DailySummary consumed={consumed} goals={dailyGoals} />
          </div>
          <div className="mt-8">
            <GoalBreakdown consumed={consumed} goals={dailyGoals} />
          </div>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Food</h2>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="animate-pulse bg-gray-700 h-5 w-16 rounded"></div>
              ) : (
                <div className="text-sm text-gray-400">
                  <span className="text-white font-medium">{totalFoodItems}</span> items
                </div>
              )}
            </div>
          </div>
          
          {/* Food Search with Spoonacular/USDA API */}
          <div id="food-search-section" className="mt-6">
            <FoodSearch 
              onAddFood={handleAddFood} 
              defaultMealType={activeMealType}
              supabase={supabase}
            />
          </div>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-700 rounded"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            ) : (
              <FoodLog 
                foodLogs={foodLogs} 
                onRemoveFood={handleRemoveFood}
                onAddFoodToMeal={handleAddFoodToMeal}
              />
            )}
          </div>
        </div>
    </AuthWrapper>
  )
}

export default MacroTracker;
