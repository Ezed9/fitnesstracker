// USDA FoodData Central API service
// Documentation: https://fdc.nal.usda.gov/api-guide.html

const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface Nutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface FoodNutrient {
  nutrient: Nutrient;
  amount: number;
}

export interface FoodPortion {
  amount: number;
  gramWeight: number;
  portionDescription?: string;
  measureUnit?: {
    name: string;
  };
}

export interface FoodItem {
  fdcId: number;
  description: string;
  lowercaseDescription?: string;
  dataType?: string;
  gtinUpc?: string;
  publishedDate?: string;
  brandOwner?: string;
  brandName?: string;
  ingredients?: string;
  marketCountry?: string;
  foodCategory?: string;
  allHighlightFields?: string;
  score?: number;
  foodNutrients?: FoodNutrient[];
  foodPortions?: FoodPortion[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface SearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  pageList: number[];
  foodSearchCriteria: any;
  foods: FoodItem[];
}

/**
 * Search for food items by query
 * @param query Search term
 * @returns Promise with search results
 */
export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    if (!query.trim()) return [];
    if (!API_KEY) {
      console.error('USDA API key is missing. Please add it to your .env.local file.');
      return [];
    }
    
    // USDA FoodData Central search endpoint
    const response = await fetch(
      `${BASE_URL}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy,Survey%20(FNDDS),Branded&pageSize=25`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: SearchResponse = await response.json();
    
    // Return all foods from the search results
    return data.foods || [];
  } catch (error) {
    console.error('Error searching for food:', error);
    throw error;
  }
};

/**
 * Get detailed nutrition information for a food item by its ID
 * @param fdcId USDA FoodData Central ID
 * @returns Promise with nutrition details
 */
export const getNutritionDetails = async (fdcId: number) => {
  try {
    if (!API_KEY) {
      console.error('USDA API key is missing. Please add it to your .env.local file.');
      return null;
    }
    
    const response = await fetch(
      `${BASE_URL}/food/${fdcId}?api_key=${API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
 * Find a nutrient value by nutrient ID
 * @param foodNutrients Array of food nutrients
 * @param nutrientId ID of the nutrient to find
 * @returns Nutrient value or 0 if not found
 */
export const getNutrientValue = (foodNutrients: FoodNutrient[] = [], nutrientId: number): number => {
  const nutrient = foodNutrients.find(item => 
    item.nutrient && item.nutrient.nutrientId === nutrientId
  );
  return nutrient ? nutrient.amount : 0;
};

/**
 * Get calories from food nutrients
 * @param foodNutrients Array of food nutrients from USDA
 * @returns Calories value
 */
export const getCalories = (foodNutrients: FoodNutrient[] = []): number => {
  // Energy (kcal) nutrient ID is 1008 in USDA database
  return getNutrientValue(foodNutrients, 1008);
};

/**
 * Get protein from food nutrients
 * @param foodNutrients Array of food nutrients from USDA
 * @returns Protein value in grams
 */
export const getProtein = (foodNutrients: FoodNutrient[] = []): number => {
  // Protein nutrient ID is 1003 in USDA database
  return getNutrientValue(foodNutrients, 1003);
};

/**
 * Get carbohydrates from food nutrients
 * @param foodNutrients Array of food nutrients from USDA
 * @returns Carbohydrates value in grams
 */
export const getCarbs = (foodNutrients: FoodNutrient[] = []): number => {
  // Carbohydrates nutrient ID is 1005 in USDA database
  return getNutrientValue(foodNutrients, 1005);
};

/**
 * Get fat from food nutrients
 * @param foodNutrients Array of food nutrients from USDA
 * @returns Fat value in grams
 */
export const getFat = (foodNutrients: FoodNutrient[] = []): number => {
  // Total fat nutrient ID is 1004 in USDA database
  return getNutrientValue(foodNutrients, 1004);
};

/**
 * Format nutrition data into the app's expected format
 * @param foodItem Food item from search results
 * @returns Formatted food data
 */
export const formatFoodData = (foodItem: FoodItem) => {
  const calories = getCalories(foodItem.foodNutrients);
  const protein = getProtein(foodItem.foodNutrients);
  const carbs = getCarbs(foodItem.foodNutrients);
  const fat = getFat(foodItem.foodNutrients);
  
  // Format serving information
  let servingInfo = '100g';
  if (foodItem.servingSize && foodItem.servingSizeUnit) {
    servingInfo = `${foodItem.servingSize} ${foodItem.servingSizeUnit}`;
  } else if (foodItem.foodPortions && foodItem.foodPortions.length > 0) {
    const portion = foodItem.foodPortions[0];
    servingInfo = portion.portionDescription || 
                 (portion.measureUnit ? 
                  `${portion.amount} ${portion.measureUnit.name} (${portion.gramWeight}g)` : 
                  `${portion.gramWeight}g`);
  }
  
  // Format brand information
  const brandInfo = foodItem.brandOwner || foodItem.brandName || '';
  const nameWithBrand = brandInfo ? 
    `${foodItem.description} (${brandInfo})` : 
    foodItem.description;
  
  return {
    name: `${nameWithBrand} - ${servingInfo}`,
    calories: Math.round(calories || 0),
    protein: Math.round(protein || 0),
    carbs: Math.round(carbs || 0),
    fat: Math.round(fat || 0),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    id: Date.now(),
    // USDA doesn't provide images, so we'll leave this empty
    image: '',
  };
};
