import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pcurktgrhgvlxlewnnph.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdXJrdGdyaGd2bHhsZXdubnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Njk2ODYsImV4cCI6MjA2MzE0NTY4Nn0.OCzhuqtCtkgNPDyd-qUnJP1t6bzHFpOWgkZ-PXf9Fpc';

// Validate Supabase credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

// Types
export interface MacroGoals {
  id?: string;
  user_id?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image_url?: string;
  serving_size?: string;
  source?: 'usda' | 'spoonacular' | 'user_created';
  source_id?: string;
}

export interface FoodLogEntry {
  id?: string;
  user_id?: string;
  food_item_id: string | null; // Can be null for manually added items
  log_date: string; // ISO format date (YYYY-MM-DD)
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  servings: number;
  serving_size?: string; // e.g., '100g', '3 oz', etc.
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  food_name?: string; // For display purposes
  log_time?: string; // Time of the log entry (HH:MM or ISO string)
  notes?: string; // Additional notes
  image_url?: string | null; // Optional image URL
  created_at?: string; // Timestamp of when the record was created (ISO string)
}

export interface DailyNutrition {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  food_count: number;
}

// User Macro Goals
export const getUserMacroGoals = async (customClient?: any): Promise<MacroGoals | null> => {
  const client = customClient || supabase;
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await client
    .from('user_macro_goals')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching macro goals:', error);
    return null;
  }

  return data;
};

export const saveUserMacroGoals = async (goals: MacroGoals): Promise<boolean> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('user_macro_goals')
    .upsert({
      user_id: user.id,
      calories: goals.calories,
      protein: goals.protein,
      carbs: goals.carbs,
      fats: goals.fats
    });

  if (error) {
    console.error('Error saving macro goals:', error);
    return false;
  }

  return true;
};

// Food Items
export const saveFoodItem = async (foodItem: FoodItem, customClient?: any): Promise<string | undefined> => {
  const client = customClient || supabase;
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) return undefined;

  try {
    // Check if this food item already exists
    const { data: existingItems } = await client
      .from('food_items')
      .select('id')
      .eq('name', foodItem.name)
      .eq('source', foodItem.source || 'user_created')
      .eq('source_id', foodItem.source_id || '')
      .maybeSingle();

    // If it exists, return the existing ID
    if (existingItems?.id) {
      console.log('Found existing food item with ID:', existingItems.id);
      return existingItems.id as string;
    }

    // Prepare the food item data without the serving_size if it doesn't exist in the schema
    const foodItemData: any = {
      name: foodItem.name,
      calories: foodItem.calories,
      protein: foodItem.protein,
      carbs: foodItem.carbs,
      fats: foodItem.fats,
      image_url: foodItem.image_url,
      source: foodItem.source || 'user_created',
      source_id: foodItem.source_id || null,
      created_by: user.id
    };

    // Only include serving_size if it exists in the foodItem
    if ('serving_size' in foodItem) {
      foodItemData.serving_size = foodItem.serving_size;
    }

    console.log('Inserting new food item:', foodItemData);
    const { data, error } = await client
      .from('food_items')
      .insert(foodItemData)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving food item:', error);
      return undefined;
    }

    console.log('Successfully saved food item with ID:', data?.id);
    return data?.id as string;
  } catch (error) {
    console.error('Unexpected error in saveFoodItem:', error);
    return undefined;
  }
};

// Food Logs
export const getFoodLogs = async (date: string, customClient?: any): Promise<FoodLogEntry[]> => {
  const client = customClient || supabase;
  console.log('Fetching food logs for date:', date);
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    console.log('No authenticated user found');
    return [];
  }

  console.log('Querying food_logs table for user:', user.id, 'and date:', date);
  const { data, error } = await client
    .from('food_logs')
    .select(`
      *,
      food_items(name, image_url)
    `)
    .eq('user_id', user.id)
    .eq('log_date', date)
    .order('log_time', { ascending: true });

  if (error) {
    console.error('Error fetching food logs:', error);
    return [];
  }

  console.log('Raw food logs from Supabase:', data);
  
  // Format the data to include food name and image
  const formattedLogs = data.map((item: any) => {
    // Ensure meal_type is valid
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    if (!validMealTypes.includes(item.meal_type)) {
      console.warn(`Invalid meal_type found in database: ${item.meal_type}, defaulting to 'snacks'`);
      item.meal_type = 'snacks';
    }
    
    console.log(`Processing log item: id=${item.id}, meal_type=${item.meal_type}, food_name=${item.food_items?.name || item.food_name || 'Unknown'}`);
    
    return {
      ...item,
      food_name: item.food_items?.name || item.food_name || 'Unknown Food',
      image_url: item.food_items?.image_url || ''
    };
  });
  
  console.log('Returning formatted logs:', formattedLogs);
  return formattedLogs;
};

export const addFoodLog = async (foodLog: FoodLogEntry, customClient?: any): Promise<string | undefined> => {
  const client = customClient || supabase;
  console.log('Adding food log with meal_type:', foodLog.meal_type);
  
  try {
    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const mealType = validMealTypes.includes(foodLog.meal_type) 
      ? foodLog.meal_type 
      : 'snacks';
    
    if (foodLog.meal_type !== mealType) {
      console.warn(`Invalid meal_type: ${foodLog.meal_type}, defaulting to 'snacks'`);
    }
    
    // Get current user
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) {
      console.error('No authenticated user found:', userError?.message || 'User not found');
      return undefined;
    }

    // Create the food log entry object
    const foodLogData: any = {
      user_id: user.id,
      food_item_id: foodLog.food_item_id || null, // Explicitly set to null if undefined
      log_date: foodLog.log_date || new Date().toISOString().split('T')[0],
      meal_type: mealType,
      servings: foodLog.servings || 1,
      calories: foodLog.calories || 0,
      protein: foodLog.protein || 0,
      carbs: foodLog.carbs || 0,
      fats: foodLog.fats || 0,
      food_name: foodLog.food_name || 'Unknown Food',
      log_time: foodLog.log_time || new Date().toISOString(),
      notes: foodLog.notes || ''
    };
    
    // Add serving size to notes if provided
    if (foodLog.serving_size) {
      foodLogData.notes = `${
        foodLogData.notes ? `${foodLogData.notes} ` : ''
      }(Serving: ${foodLog.serving_size})`.trim();
      
      // Try to add serving_size to the object, but it might fail if the column doesn't exist
      try {
        foodLogData.serving_size = foodLog.serving_size;
      } catch (e) {
        console.log('Note: serving_size column may not exist in database schema');
      }
    }
    
    console.log('Inserting food log into Supabase with data:', JSON.stringify({
      ...foodLogData,
      // Don't log the entire notes if it's too long
      notes: foodLogData.notes.length > 100 
        ? `${foodLogData.notes.substring(0, 100)}...` 
        : foodLogData.notes
    }, null, 2));
    
    console.log('Executing Supabase insert...');
    const { data, error } = await client
      .from('food_logs')
      .insert(foodLogData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error adding food log:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return undefined;
    }
    
    console.log('Successfully added food log with ID:', data?.id);
    return data?.id as string;
  } catch (error) {
    console.error('Unexpected error in addFoodLog:', error);
    return undefined;
  }
};

export const removeFoodLog = async (logId: string, customClient?: any): Promise<boolean> => {
  const client = customClient || supabase;
  const { error } = await client
    .from('food_logs')
    .delete()
    .match({ id: logId });

  if (error) {
    console.error('Error removing food log:', error);
    return false;
  }

  return true;
};

// Daily Nutrition Summary
export const getDailyNutrition = async (date: string): Promise<DailyNutrition | null> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_daily_nutrition')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', date)
    .single();

  if (error) {
    // If no data found, return zeros
    if (error.code === 'PGRST116') {
      return {
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fats: 0,
        food_count: 0
      };
    }
    console.error('Error fetching daily nutrition:', error);
    return null;
  }

  return data;
};
