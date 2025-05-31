// Edamam Food Database API service
// Documentation: https://developer.edamam.com/food-database-api-docs

const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '';
const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '';
const BASE_URL = 'https://api.edamam.com/api/food-database/v2';

export interface NutrientInfo {
  ENERC_KCAL: number; // calories
  PROCNT: number; // protein
  FAT: number; // fat
  CHOCDF: number; // carbs
  FIBTG?: number; // fiber
}

export interface FoodItem {
  foodId: string;
  label: string;
  nutrients: NutrientInfo;
  category: string;
  categoryLabel: string;
  image?: string;
}

export interface SearchResponse {
  text: string;
  parsed: any[];
  hints: {
    food: FoodItem;
    measures: {
      uri: string;
      label: string;
      weight: number;
    }[];
  }[];
}

/**
 * Search for food items by query
 * @param query Search term
 * @returns Promise with search results
 */
export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    if (!query.trim()) return [];
    
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      ingr: query,
    });
    
    const response = await fetch(`${BASE_URL}/parser?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    // Transform the response into a simpler format
    return data.hints.map(item => item.food);
  } catch (error) {
    console.error('Error searching for food:', error);
    throw error;
  }
};

/**
 * Get detailed nutrition information for a food item
 * @param foodId Food ID from the search results
 * @param measure Measure URI (optional)
 * @param quantity Quantity (optional, default 1)
 * @returns Promise with nutrition details
 */
export const getNutritionDetails = async (
  foodId: string,
  measureURI?: string,
  quantity: number = 1
) => {
  try {
    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
    });
    
    const body = {
      ingredients: [
        {
          quantity,
          measureURI: measureURI || 'http://www.edamam.com/ontologies/edamam.owl#Measure_unit',
          foodId,
        },
      ],
    };
    
    const response = await fetch(`${BASE_URL}/nutrients?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    name: foodItem.label,
    calories: Math.round(foodItem.nutrients.ENERC_KCAL || 0),
    protein: Math.round(foodItem.nutrients.PROCNT || 0),
    carbs: Math.round(foodItem.nutrients.CHOCDF || 0),
    fat: Math.round(foodItem.nutrients.FAT || 0),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    id: Date.now(),
    image: foodItem.image,
  };
};
