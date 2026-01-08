import { SupabaseClient } from '@supabase/supabase-js';

// We'll no longer create a default Supabase client here
// Instead, we'll require the client to be passed to each function

// Types

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
export const getUserMacroGoals = async (supabase: SupabaseClient): Promise<MacroGoals | null> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  // Get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('Error getting user session:', sessionError);
    throw new Error('You must be logged in to view macro goals');
  }

  const { data, error } = await supabase
    .from('user_macro_goals')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching macro goals:', error);
    return null;
  }

  return data;
};

export const saveUserMacroGoals = async (supabase: SupabaseClient, goals: MacroGoals): Promise<boolean> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  // Get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('Error getting user session:', sessionError);
    throw new Error('You must be logged in to save macro goals');
  }

  const { error } = await supabase
    .from('user_macro_goals')
    .upsert({
      user_id: session.user.id,
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
export const saveFoodItem = async (supabase: SupabaseClient, foodItem: FoodItem): Promise<string | undefined> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  // Get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('Error getting user session:', sessionError);
    throw new Error('You must be logged in to save food items');
  }

  const userId = session.user.id;

  try {
    // Check if this food item already exists
    const { data: existingItems } = await supabase
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
      created_by: userId
    };

    // Only include serving_size if it exists in the foodItem
    if ('serving_size' in foodItem) {
      foodItemData.serving_size = foodItem.serving_size;
    }

    console.log('Inserting new food item:', foodItemData);
    const { data, error } = await supabase
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
export const getFoodLogs = async (supabase: SupabaseClient, date: string): Promise<FoodLogEntry[]> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  console.log('Fetching food logs for date:', date);

  // Get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('Error getting user session:', sessionError);
    throw new Error('You must be logged in to view food logs');
  }

  const userId = session.user.id;
  console.log('Querying food_logs table for user:', userId, 'and date:', date);

  const { data, error } = await supabase
    .from('food_logs')
    .select(`
      *,
      food_items(name, image_url)
    `)
    .eq('user_id', userId)
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

export const addFoodLog = async (supabase: SupabaseClient, foodLog: FoodLogEntry): Promise<string | undefined> => {
  try {
    if (!supabase) {
      throw new Error('Supabase client is required');
    }

    console.log('[addFoodLog] Starting to add food log:', {
      food_name: foodLog.food_name,
      meal_type: foodLog.meal_type,
      log_date: foodLog.log_date,
      has_image: !!foodLog.image_url
    });

    // Validate and normalize meal type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
    const mealType = validMealTypes.includes(foodLog.meal_type as any)
      ? foodLog.meal_type
      : 'snacks';

    if (foodLog.meal_type !== mealType) {
      console.warn(`[addFoodLog] Invalid meal_type: ${foodLog.meal_type}, defaulting to 'snacks'`);
    }

    // Get current user session
    console.log('[addFoodLog] Attempting to get session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[addFoodLog] Error getting session:', sessionError);
      throw new Error(`Session error: ${sessionError.message}`);
    }

    console.log('[addFoodLog] Session data:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id
    });

    if (!session?.user) {
      throw new Error('You must be logged in to add food');
    }

    // Prepare the food log data with proper types and defaults
    const notes = foodLog.notes || '';
    const notesWithServing = foodLog.serving_size && !notes.includes('Serving:')
      ? `${notes}${notes ? ' ' : ''}(Serving: ${foodLog.serving_size})`.trim()
      : notes;

    const foodLogData = {
      food_item_id: foodLog.food_item_id ?? null,
      log_date: foodLog.log_date || new Date().toISOString().split('T')[0],
      meal_type: mealType,
      servings: foodLog.servings ?? 1,
      calories: foodLog.calories ?? 0,
      protein: foodLog.protein ?? 0,
      carbs: foodLog.carbs ?? 0,
      fats: foodLog.fats ?? 0,
      food_name: foodLog.food_name || 'Unknown Food',
      log_time: foodLog.log_time || new Date().toTimeString().substring(0, 5),
      notes: notesWithServing,
      image_url: foodLog.image_url ?? null,
      serving_size: foodLog.serving_size || null,
      user_id: session.user.id // Add user_id from the session
    };

    // Log the prepared data (truncate long notes for logging)
    const notesForLog = foodLogData.notes.length > 100
      ? `${foodLogData.notes.substring(0, 100)}...`
      : foodLogData.notes;

    console.log('[addFoodLog] Prepared food log data:', {
      ...foodLogData,
      notes: notesForLog
    });

    // Execute the insert
    const { data: result, error: insertError } = await supabase
      .from('food_logs')
      .insert(foodLogData)
      .select('id')
      .single();

    if (insertError) {
      console.error('[addFoodLog] Database error:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });

      // Handle specific error cases
      if (insertError.code === '23505') { // Unique violation
        throw new Error('This food entry already exists');
      } else if (insertError.code === '23503') { // Foreign key violation
        throw new Error('Invalid food item reference');
      } else {
        throw new Error('Failed to save food log. Please try again.');
      }
    }

    console.log(`[addFoodLog] Successfully added food log with ID: ${result?.id}`);
    return result?.id;

  } catch (error) {
    console.error('[addFoodLog] Unexpected error:', error);
    throw error; // Re-throw to allow callers to handle the error
  }
};

export const removeFoodLog = async (supabase: SupabaseClient, logId: string): Promise<boolean> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('Error removing food log:', error);
    return false;
  }

  return true;
};

// Daily Nutrition Summary
export const getDailyNutrition = async (supabase: SupabaseClient, date: string): Promise<DailyNutrition | null> => {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  // Get current user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('Error getting user session:', sessionError);
    throw new Error('You must be logged in to view daily nutrition');
  }

  const { data, error } = await supabase
    .from('user_daily_nutrition')
    .select('*')
    .eq('user_id', session.user.id)
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

export const getWeightHistory = async (supabase: SupabaseClient): Promise<{ date: string, weight: number }[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('weight_entries')
    .select('date, weight')
    .eq('user_id', session.user.id)
    .order('date', { ascending: true })
    .limit(30);

  if (error) {
    console.error('Error fetching weight history:', error);
    return [];
  }

  return data;
};

export const saveWeightEntry = async (supabase: SupabaseClient, weight: number, date: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('weight_entries')
    .insert({
      user_id: session.user.id,
      weight,
      date
    });

  if (error) {
    console.error('Error saving weight entry:', error);
    return false;
  }

  return true;
};
