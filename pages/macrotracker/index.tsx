import React, { useState } from 'react'
import { CalendarIcon, PlusCircleIcon, SearchIcon } from 'lucide-react'
import AuthWrapper from '@/components/AuthWrapper/index'
import Layout from '@/components/layout/Layout/index'
import { DailySummary } from '@/components/macros/DailySummary'
import { GoalBreakdown } from '@/components/macros/GoalBreakdown'
import { FoodLog } from '@/components/macros/FoodLog'
import { Header } from '@/components/macros/Header'
import { MotivationalText } from '@/components/macros/MotivationalText'

export default function MacroTracker() {
  const [date, setDate] = useState(new Date())
  // Sample data for the tracker
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  }
  const consumed = {
    calories: 1450,
    protein: 125,
    carbs: 130,
    fat: 45,
  }
  const foodItems = [
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
  ]

  return (
    <AuthWrapper>
      <Layout>
        <div className="flex flex-col min-h-screen w-full bg-[#121212] text-white">
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
              <div className="flex space-x-2">
                <button className="flex items-center bg-[#60A5FA] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Quick Add
                </button>
              </div>
            </div>
            <div className="mt-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search foods..."
                  className="w-full px-4 py-3 pl-10 bg-[#1E1E1E] border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4ADE80]"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="mt-6">
              <FoodLog foodItems={foodItems} />
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
