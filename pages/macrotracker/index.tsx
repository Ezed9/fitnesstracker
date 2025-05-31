import React, { useState, useEffect } from 'react'
import { CalendarIcon, PlusCircleIcon, SearchIcon } from 'lucide-react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { DailySummary } from '@/components/macros/DailySummary'
import { GoalBreakdown } from '@/components/macros/GoalBreakdown'
import { FoodLog } from '@/components/macros/FoodLog'
import { Header } from '@/components/macros/Header'
import { MotivationalText } from '@/components/macros/MotivationalText'
import FoodSearch from '@/components/macros/FoodSearch'

export default function MacroTracker() {
  const [date, setDate] = useState(new Date())
  // Daily goals for the tracker
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  }
  
  // State for food items and consumed macros
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: 'Grilled Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      time: '8:30 AM',
      mealType: 'breakfast' as 'breakfast',
    },
    {
      id: 2,
      name: 'Brown Rice',
      calories: 215,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      time: '12:30 PM',
      mealType: 'lunch' as 'lunch',
    },
    {
      id: 3,
      name: 'Greek Yogurt',
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4,
      time: '3:00 PM',
      mealType: 'snacks' as 'snacks',
    },
    {
      id: 4,
      name: 'Protein Shake',
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1,
      time: '5:30 PM',
      mealType: 'snacks' as 'snacks',
    },
    {
      id: 5,
      name: 'Mixed Vegetables',
      calories: 85,
      protein: 3,
      carbs: 17,
      fat: 0.2,
      time: '7:00 PM',
      mealType: 'dinner' as 'dinner',
    },
  ])
  
  // Calculate consumed macros based on food items
  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  
  // Update consumed macros whenever food items change
  useEffect(() => {
    const totals = foodItems.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
    
    setConsumed(totals)
  }, [foodItems])
  
  // Handle adding a new food item
  const handleAddFood = (newFood: any) => {
    setFoodItems([...foodItems, newFood])
  }
  
  // Handle removing a food item
  const handleRemoveFood = (id: number) => {
    setFoodItems(foodItems.filter(item => item.id !== id))
  }

  return (
    <AuthWrapper>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Header date={date} setDate={setDate} />
          <MotivationalText consumed={consumed} goals={dailyGoals} />
          <div className="mt-6">
            <DailySummary consumed={consumed} goals={dailyGoals} />
          </div>
          <div className="mt-8">
            <GoalBreakdown consumed={consumed} goals={dailyGoals} />
          </div>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Food</h2>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-400">
                <span className="text-white font-medium">{foodItems.length}</span> items
              </div>
            </div>
          </div>
          
          {/* Food Search with Edamam API */}
          <FoodSearch onAddFood={handleAddFood} />
          
          <div className="mt-6">
            <FoodLog foodItems={foodItems} onRemoveFood={handleRemoveFood} />
          </div>
        </div>
    </AuthWrapper>
  )
}
