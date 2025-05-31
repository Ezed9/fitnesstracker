# USDA FoodData Central API Setup

To use the USDA FoodData Central API in this application, you need to:

1. Sign up for a free API key at: https://fdc.nal.usda.gov/api-key-signup.html

2. Once you have your API key, add it to your `.env.local` file:

```
# Keep your existing Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Add your USDA API key
NEXT_PUBLIC_USDA_API_KEY=your_usda_api_key
```

3. Restart your development server for the changes to take effect.

## About the USDA FoodData Central API

The USDA FoodData Central API provides comprehensive nutritional information for a wide variety of foods. It includes:

- Detailed macronutrient data (calories, protein, carbs, fat)
- Serving size information
- Brand details for commercial products
- Comprehensive food database with regular updates

This API is used in both the Macros page and Dashboard's Quick Add Food feature to provide accurate nutritional information for food logging.
