-- Create user_macro_goals table
CREATE TABLE IF NOT EXISTS user_macro_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calories INTEGER NOT NULL DEFAULT 2000,
  protein INTEGER NOT NULL DEFAULT 150,
  carbs INTEGER NOT NULL DEFAULT 200,
  fats INTEGER NOT NULL DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fats INTEGER NOT NULL,
  image_url TEXT,
  serving_size TEXT,
  source TEXT DEFAULT 'user_created',
  source_id TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(name, source, source_id)
);

-- Create food_logs table
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES food_items(id),
  log_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  servings NUMERIC NOT NULL DEFAULT 1,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fats INTEGER NOT NULL,
  log_time TIME DEFAULT CURRENT_TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a view for daily nutrition summary
CREATE OR REPLACE VIEW user_daily_nutrition AS
SELECT
  user_id,
  log_date,
  SUM(calories) AS total_calories,
  SUM(protein) AS total_protein,
  SUM(carbs) AS total_carbs,
  SUM(fats) AS total_fats,
  COUNT(*) AS food_count
FROM
  food_logs
GROUP BY
  user_id, log_date;

-- Row Level Security Policies
-- Enable RLS on all tables
ALTER TABLE user_macro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- User Macro Goals policies
CREATE POLICY "Users can view their own macro goals"
  ON user_macro_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macro goals"
  ON user_macro_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macro goals"
  ON user_macro_goals FOR UPDATE
  USING (auth.uid() = user_id);

-- Food Items policies
CREATE POLICY "Anyone can view food items"
  ON food_items FOR SELECT
  USING (true);

CREATE POLICY "Users can insert food items"
  ON food_items FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Food Logs policies
CREATE POLICY "Users can view their own food logs"
  ON food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
  ON food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
  ON food_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
  ON food_logs FOR DELETE
  USING (auth.uid() = user_id);
