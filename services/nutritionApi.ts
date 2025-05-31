// services/nutritionApi.ts
// Combined Spoonacular and USDA FoodData Central API integration

// Spoonacular API constants
const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// USDA API constants
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || '';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Spoonacular API types
export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
}

export interface SpoonacularFoodItem {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  nutrition?: {
    nutrients: Nutrient[];
  };
}

export interface SpoonacularSearchResponse {
  results: SpoonacularFoodItem[];
  offset: number;
  number: number;
  totalResults: number;
}

// USDA API types
export interface UsdaNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  value: number;
  unitName: string;
}

export interface UsdaFoodItem {
  fdcId: number;
  description: string;
  foodNutrients: UsdaNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface UsdaSearchResponse {
  foods: UsdaFoodItem[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

// Unified Food Item type for the app
export interface UnifiedFoodItem {
  id: string | number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize?: string;
  servingSizeG?: number; // Serving size in grams for portion calculations
  image?: string;
  source: 'usda' | 'spoonacular';
}

// For backward compatibility
export type FoodItem = SpoonacularFoodItem;

// Raw ingredient keywords to help determine which API to use first
const RAW_INGREDIENT_KEYWORDS = [
  'raw', 'uncooked', 'fresh', 'whole', 'natural', 'plain',
  'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry',
  'chicken breast', 'beef', 'pork', 'lamb', 'turkey', 'fish', 
  'rice', 'oats', 'quinoa', 'flour', 'sugar', 'salt',
  'milk', 'egg', 'butter', 'oil', 'water'
];

// Check if the query likely refers to a raw ingredient
const isLikelyRawIngredient = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return RAW_INGREDIENT_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
};

// Helper functions to extract macros from Spoonacular nutrient arrays
const getSpoonacularNutrient = (nutrients: Nutrient[], name: string): number => {
  const nutrient = nutrients.find(n => n.name === name);
  return nutrient?.amount || 0;
};

const getCalories = (food: SpoonacularFoodItem): number => {
  if (!food.nutrition || !food.nutrition.nutrients) return 0;
  return getSpoonacularNutrient(food.nutrition.nutrients, 'Calories');
};

const getProtein = (food: SpoonacularFoodItem): number => {
  if (!food.nutrition || !food.nutrition.nutrients) return 0;
  return getSpoonacularNutrient(food.nutrition.nutrients, 'Protein');
};

const getCarbs = (food: SpoonacularFoodItem): number => {
  if (!food.nutrition || !food.nutrition.nutrients) return 0;
  return getSpoonacularNutrient(food.nutrition.nutrients, 'Carbohydrates');
};

const getFat = (food: SpoonacularFoodItem): number => {
  if (!food.nutrition || !food.nutrition.nutrients) return 0;
  return getSpoonacularNutrient(food.nutrition.nutrients, 'Fat');
};

// Combined search function that intelligently chooses which API to query first
export const searchFoodItems = async (query: string): Promise<UnifiedFoodItem[]> => {
  try {
    if (!query.trim()) return [];
    
    // Check API keys
    if (!SPOONACULAR_API_KEY && !USDA_API_KEY) {
      console.error('Both Spoonacular and USDA API keys are missing. Please add them to your .env.local file.');
      return [];
    }
    
    // Determine which API to try first based on the query
    const isRawIngredient = isLikelyRawIngredient(query);
    let results: UnifiedFoodItem[] = [];
    
    // Try the first API based on the query type
    if (isRawIngredient && USDA_API_KEY) {
      results = await searchUsdaFoods(query);
      // If no results, try Spoonacular as fallback
      if (results.length === 0 && SPOONACULAR_API_KEY) {
        results = await searchSpoonacularFoods(query);
      }
    } else if (SPOONACULAR_API_KEY) {
      results = await searchSpoonacularFoods(query);
      // If no results, try USDA as fallback
      if (results.length === 0 && USDA_API_KEY) {
        results = await searchUsdaFoods(query);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching food items:', error);
    return [];
  }
};

// Search USDA FoodData Central API
const searchUsdaFoods = async (query: string): Promise<UnifiedFoodItem[]> => {
  try {
    if (!USDA_API_KEY) return [];
    
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }
    
    const data: UsdaSearchResponse = await response.json();
    
    if (!data.foods || data.foods.length === 0) {
      return [];
    }
    
    return data.foods.map((food: UsdaFoodItem): UnifiedFoodItem => {
      // Extract nutrients from USDA format
      const getNutrientValue = (name: string): number => {
        const nutrient = food.foodNutrients.find((n: UsdaNutrient) => 
          n.nutrientName.toLowerCase().includes(name.toLowerCase())
        );
        return nutrient ? nutrient.value : 0;
      };
      
      // Map USDA nutrients to our unified format
      const calories = getNutrientValue('energy');
      const protein = getNutrientValue('protein');
      const carbs = getNutrientValue('carbohydrate');
      const fats = getNutrientValue('fat');
      
      const servingInfo = food.servingSize 
        ? `${food.servingSize} ${food.servingSizeUnit || 'g'}`
        : '100g';
      
      return {
        id: food.fdcId,
        name: food.description,
        calories,
        protein,
        carbs,
        fats,
        servingSize: servingInfo,
        image: '', // USDA doesn't provide images
        source: 'usda'
      };
    });
  } catch (error) {
    console.error('Error searching USDA foods:', error);
    return [];
  }
};

// Search Spoonacular API
const searchSpoonacularFoods = async (query: string): Promise<UnifiedFoodItem[]> => {
  try {
    if (!SPOONACULAR_API_KEY) return [];
    
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&number=10&addRecipeNutrition=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const data: SpoonacularSearchResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    return data.results.map((food: SpoonacularFoodItem): UnifiedFoodItem => {
      return {
        id: food.id,
        name: food.title,
        calories: getCalories(food),
        protein: getProtein(food),
        carbs: getCarbs(food),
        fats: getFat(food),
        servingSize: 'Standard Serving',
        image: food.image,
        source: 'spoonacular'
      };
    });
  } catch (error) {
    console.error('Error searching Spoonacular foods:', error);
    return [];
  }
};

// Get detailed nutrition information for a specific food item
export const getFoodDetails = async (id: number | string, source: 'usda' | 'spoonacular'): Promise<UnifiedFoodItem | null> => {
  try {
    if (source === 'spoonacular') {
      if (!SPOONACULAR_API_KEY) {
        console.error('Spoonacular API key is missing');
        return null;
      }
      
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch food details from Spoonacular: ${response.status}`);
      }
      
      const food: SpoonacularFoodItem = await response.json();
      
      return {
        id: food.id,
        name: food.title,
        calories: getCalories(food),
        protein: getProtein(food),
        carbs: getCarbs(food),
        fats: getFat(food),
        servingSize: 'Standard Serving',
        image: food.image,
        source: 'spoonacular'
      };
    } else {
      if (!USDA_API_KEY) {
        console.error('USDA API key is missing');
        return null;
      }
      
      const response = await fetch(
        `${USDA_BASE_URL}/food/${id}?api_key=${USDA_API_KEY}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch food details from USDA: ${response.status}`);
      }
      
      const food: UsdaFoodItem = await response.json();
      
      // Extract nutrients from USDA format
      const getNutrientValue = (name: string): number => {
        const nutrient = food.foodNutrients.find((n: UsdaNutrient) => 
          n.nutrientName.toLowerCase().includes(name.toLowerCase())
        );
        return nutrient ? nutrient.value : 0;
      };
      
      const calories = getNutrientValue('energy');
      const protein = getNutrientValue('protein');
      const carbs = getNutrientValue('carbohydrate');
      const fats = getNutrientValue('fat');
      
      const servingInfo = food.servingSize 
        ? `${food.servingSize} ${food.servingSizeUnit || 'g'}`
        : '100g';
      
      return {
        id: food.fdcId,
        name: food.description,
        calories,
        protein,
        carbs,
        fats,
        servingSize: servingInfo,
        image: '', // USDA doesn't provide images
        source: 'usda'
      };
    }
  } catch (error) {
    console.error('Error getting food details:', error);
    return null;
  }
};

// Format food data for the app (for backward compatibility)
export const formatFoodData = (foodItem: SpoonacularFoodItem | UnifiedFoodItem): any => {
  if ('source' in foodItem) {
    // It's already a UnifiedFoodItem
    const item = foodItem as UnifiedFoodItem;
    return {
      name: `${item.name} (${item.servingSize || 'Standard Serving'})`,
      calories: Math.round(item.calories || 0),
      protein: Math.round(item.protein || 0),
      carbs: Math.round(item.carbs || 0),
      fat: Math.round(item.fats || 0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      id: Date.now(),
      image: item.image || '',
      source: item.source
    };
  } else {
    // It's a SpoonacularFoodItem
    const item = foodItem as SpoonacularFoodItem;
    return {
      name: `${item.title} (Standard Serving)`,
      calories: Math.round(getCalories(item) || 0),
      protein: Math.round(getProtein(item) || 0),
      carbs: Math.round(getCarbs(item) || 0),
      fat: Math.round(getFat(item) || 0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: 'snacks' as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
      id: Date.now(),
      image: item.image || '',
      source: 'spoonacular' as 'usda' | 'spoonacular'
    };
  }
};
