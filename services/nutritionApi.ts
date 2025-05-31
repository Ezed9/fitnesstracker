// Open Food Facts API service
// Documentation: https://openfoodfacts.github.io/api-documentation/

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export interface Nutriments {
  'energy-kcal_100g'?: number;
  'energy-kcal'?: number;
  'energy_100g'?: number;
  'energy-kj_100g'?: number;
  'proteins_100g'?: number;
  'carbohydrates_100g'?: number;
  'fat_100g'?: number;
  'fiber_100g'?: number;
}

export interface FoodItem {
  id: string;
  product_name: string;
  product_name_en?: string;
  brands?: string;
  quantity?: string;
  serving_size?: string;
  serving_quantity?: number;
  nutriments: Nutriments;
  image_url?: string;
  image_small_url?: string;
  image_thumb_url?: string;
}

export interface SearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: FoodItem[];
}

/**
 * Search for food items by query
 * @param query Search term
 * @returns Promise with search results
 */
export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    if (!query.trim()) return [];
    
    // Open Food Facts search endpoint
    const response = await fetch(
      `${BASE_URL}/search?search_terms=${encodeURIComponent(query)}&fields=id,product_name,product_name_en,brands,quantity,serving_size,nutriments,image_url,image_small_url,image_thumb_url&page_size=20`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FitTrack-App - Web - Version 1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    // Filter out products without nutritional information
    return data.products.filter(product => {
      return product.product_name && (
        product.nutriments['energy-kcal_100g'] ||
        product.nutriments['energy-kcal'] ||
        product.nutriments['energy_100g']
      );
    });
  } catch (error) {
    console.error('Error searching for food:', error);
    throw error;
  }
};

/**
 * Get detailed nutrition information for a food item by its ID
 * @param id Open Food Facts product ID
 * @returns Promise with nutrition details
 */
export const getNutritionDetails = async (id: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/product/${id}?fields=id,product_name,product_name_en,brands,quantity,serving_size,nutriments,image_url,image_small_url`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FitTrack-App - Web - Version 1.0'
        }
      }
    );
    
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
 * Calculate calories from kJ if calories are not available
 * @param kj Energy in kilojoules
 * @returns Calories
 */
const kJToKcal = (kj: number): number => {
  return kj * 0.239;
};

/**
 * Get calories from nutriments object, handling different formats
 * @param nutriments Nutriments object from Open Food Facts
 * @returns Calories value
 */
export const getCalories = (nutriments: Nutriments): number => {
  // Try different fields that might contain calorie information
  if (nutriments['energy-kcal_100g'] !== undefined) {
    return nutriments['energy-kcal_100g'];
  } else if (nutriments['energy-kcal'] !== undefined) {
    return nutriments['energy-kcal'];
  } else if (nutriments['energy_100g'] !== undefined) {
    // energy_100g is usually in kJ, convert to kcal
    return kJToKcal(nutriments['energy_100g']);
  } else if (nutriments['energy-kj_100g'] !== undefined) {
    return kJToKcal(nutriments['energy-kj_100g']);
  }
  return 0;
};

/**
 * Format nutrition data into the app's expected format
 * @param foodItem Food item from search results
 * @returns Formatted food data
 */
export const formatFoodData = (foodItem: FoodItem) => {
  const calories = getCalories(foodItem.nutriments);
  const servingInfo = foodItem.serving_size || foodItem.quantity || '100g';
  
  return {
    name: `${foodItem.product_name || foodItem.product_name_en || 'Unknown food'} (${servingInfo})`,
    calories: Math.round(calories || 0),
    protein: Math.round(foodItem.nutriments['proteins_100g'] || 0),
    carbs: Math.round(foodItem.nutriments['carbohydrates_100g'] || 0),
    fat: Math.round(foodItem.nutriments['fat_100g'] || 0),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    id: Date.now(),
    image: foodItem.image_thumb_url || foodItem.image_small_url || foodItem.image_url,
  };
};
