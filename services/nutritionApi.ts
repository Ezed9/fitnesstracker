// Nutritionix API service
// Documentation: https://developer.nutritionix.com/docs/v2

const API_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY || '';
const BASE_URL = 'https://trackapi.nutritionix.com/v2';

export interface NutrientInfo {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbohydrate_g: number;
  fiber_g?: number;
}

export interface FoodItem {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  nf_protein: number;
  nf_dietary_fiber?: number;
  photo: {
    thumb: string;
    highres?: string;
  };
  tag_id?: string;
  nix_item_id?: string;
}

export interface SearchResponse {
  common: FoodItem[];
  branded: FoodItem[];
}

/**
 * Search for food items by query
 * @param query Search term
 * @returns Promise with search results
 */
export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    if (!query.trim()) return [];
    
    const response = await fetch(`${BASE_URL}/search/instant?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-app-id': API_ID,
        'x-app-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    // Combine common and branded foods, but prioritize common foods
    return [...data.common, ...data.branded];
  } catch (error) {
    console.error('Error searching for food:', error);
    throw error;
  }
};

/**
 * Get detailed nutrition information for a food item
 * @param query Food name or description
 * @returns Promise with nutrition details
 */
export const getNutritionDetails = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/natural/nutrients`, {
      method: 'POST',
      headers: {
        'x-app-id': API_ID,
        'x-app-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting nutrition details:', error);
    throw error;
  }
};

/**
 * Format nutrition data into the app's expected format
 * @param foodItem Food item from search results
 * @returns Formatted food data
 */
export const formatFoodData = (foodItem: FoodItem) => {
  return {
    name: `${foodItem.food_name} (${foodItem.serving_qty} ${foodItem.serving_unit})`,
    calories: Math.round(foodItem.nf_calories || 0),
    protein: Math.round(foodItem.nf_protein || 0),
    carbs: Math.round(foodItem.nf_total_carbohydrate || 0),
    fat: Math.round(foodItem.nf_total_fat || 0),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    id: Date.now(),
    image: foodItem.photo?.thumb,
  };
};
