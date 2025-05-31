import React from 'react'
import { Trash2Icon, PlusIcon } from 'lucide-react'
import { FoodLogEntry } from '@/services/supabaseService';

interface FoodLogProps {
  foodLogs: Record<string, FoodLogEntry[]>
  onRemoveFood?: (id: string, mealType: string) => void
  onAddFoodToMeal?: (mealType: string) => void
}

interface MealSectionProps {
  title: string;
  items: FoodLogEntry[];
  onRemoveFood?: (id: string, mealType: string) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  onAddFoodToMeal?: (mealType: string) => void;
  mealTotal: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MealSection: React.FC<MealSectionProps> = ({ title, items, onRemoveFood, mealType, onAddFoodToMeal, mealTotal }) => {
  // Get meal icon based on meal type
  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🥗';
      case 'dinner':
        return '🍽️';
      case 'snacks':
        return '🍎';
      default:
        return '🍴';
    }
  };
  
  // Get meal header color based on meal type
  const getMealHeaderColor = () => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-yellow-500/10';
      case 'lunch':
        return 'bg-green-500/10';
      case 'dinner':
        return 'bg-purple-500/10';
      case 'snacks':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-700';
    }
  };
  
  // Use provided mealTotal for calculations
  return (
    <div className="mb-8">
      <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${getMealHeaderColor()}`}>
        <div className="flex items-center">
          <span className="text-xl mr-2">{getMealIcon()}</span>
          <h3 className="text-lg font-semibold text-white capitalize mr-2">{title}</h3>
          <div className="text-sm text-gray-400">
            {items.length} item{items.length !== 1 ? 's' : ''} • {mealTotal.calories} cal
          </div>
        </div>
        <button 
          onClick={() => onAddFoodToMeal && onAddFoodToMeal(mealType)}
          className="text-[#4ADE80] hover:text-green-400 flex items-center text-sm"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Food
        </button>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-[#1E1E1E] rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm">
            No foods logged for {title.toLowerCase()} yet.
          </p>
          <button
            onClick={() => onAddFoodToMeal && onAddFoodToMeal(mealType)}
            className="mt-2 text-[#4ADE80] hover:text-green-400 text-sm font-medium"
          >
            Add your first {title.toLowerCase()} item
          </button>
        </div>
      ) : (
        <>
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-700/50 rounded-lg transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white truncate">{item.food_name || 'Unnamed Food'}</span>
                    {item.serving_size && (
                      <span className="text-xs text-gray-400">({item.serving_size})</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.log_time?.substring(0, 5) || '--:--'} • {item.calories} cal • P: {item.protein}g • C: {item.carbs}g • F: {item.fats}g
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFood?.(item.id || '', mealType);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="Remove food"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
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
                      <div className="text-sm font-medium">{item.food_name || 'Unnamed Food'}</div>
                      {item.serving_size && (
                        <div className="text-xs text-gray-400">{item.serving_size}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-right">{item.calories}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-right">{item.protein}g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-right">{item.carbs}g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-right">{item.fats}g</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-right text-gray-400">
                        {item.log_time?.substring(0, 5) || '--:--'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onRemoveFood && onRemoveFood(item.id || '', mealType)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export const FoodLog: React.FC<FoodLogProps> = ({ foodLogs, onRemoveFood, onAddFoodToMeal }) => {
  // Calculate total macros for a meal
  const calculateMealTotal = (items: FoodLogEntry[] = []) => {
    return items.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0) * (item.servings || 1),
        protein: acc.protein + (item.protein || 0) * (item.servings || 1),
        carbs: acc.carbs + (item.carbs || 0) * (item.servings || 1),
        fat: acc.fat + (item.fats || 0) * (item.servings || 1),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Calculate totals for each meal
  const mealTotals = {
    breakfast: calculateMealTotal(foodLogs.breakfast),
    lunch: calculateMealTotal(foodLogs.lunch),
    dinner: calculateMealTotal(foodLogs.dinner),
    snacks: calculateMealTotal(foodLogs.snacks),
  };

  return (
    <div className="space-y-6">
      <MealSection
        title="Breakfast"
        items={foodLogs.breakfast || []}
        onRemoveFood={onRemoveFood}
        mealType="breakfast"
        onAddFoodToMeal={onAddFoodToMeal}
        mealTotal={mealTotals.breakfast}
      />
      <MealSection
        title="Lunch"
        items={foodLogs.lunch || []}
        onRemoveFood={onRemoveFood}
        mealType="lunch"
        onAddFoodToMeal={onAddFoodToMeal}
        mealTotal={mealTotals.lunch}
      />
      <MealSection
        title="Dinner"
        items={foodLogs.dinner || []}
        onRemoveFood={onRemoveFood}
        mealType="dinner"
        onAddFoodToMeal={onAddFoodToMeal}
        mealTotal={mealTotals.dinner}
      />
      <MealSection
        title="Snacks"
        items={foodLogs.snacks || []}
        onRemoveFood={onRemoveFood}
        mealType="snacks"
        onAddFoodToMeal={onAddFoodToMeal}
        mealTotal={mealTotals.snacks}
      />
    </div>
  );
};
