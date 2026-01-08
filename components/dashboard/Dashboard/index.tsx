
import React from 'react'
import { BarChartIcon, DumbbellIcon, TimerIcon, FlameIcon, ArrowRightIcon } from 'lucide-react'
import { MacroCard } from '../MacroCard'
import { WorkoutCard } from '../WorkoutCard'
import { MotivationalText } from '../MotivationalText'
import { BodyWeightGraph } from '../BodyWeightGraph'
import Calendar from '@/components/Calendar/Calendar'
import { workoutData as mockWorkoutData, splitColors } from '@/components/mockData'
import Link from 'next/link'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { getUserMacroGoals, getDailyNutrition, getWeightHistory, getFoodLogs, MacroGoals, DailyNutrition } from '@/services/supabaseService'
import { getWorkouts } from '@/services/workoutService'

export default function Dashboard() {
  const supabase = useSupabase()
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Real Data State
  const [macros, setMacros] = useState({
    calories: { current: 0, target: 2000, unit: 'kcal' },
    protein: { current: 0, target: 150, unit: 'g' },
    carbs: { current: 0, target: 200, unit: 'g' },
    fats: { current: 0, target: 65, unit: 'g' }
  })
  const [weightData, setWeightData] = useState<{ date: string, weight: number }[]>([])
  const [foodData, setFoodData] = useState<any>({
    calories: [], // { name, amount, unit }
    protein: [],
    carbs: [],
    fats: []
  })
  const [nextWorkout, setNextWorkout] = useState<any>(null)
  const [workoutData, setWorkoutData] = useState<any[]>([])

  // Mock Data for Demo Mode
  const demoMacros = {
    calories: { current: 1450, target: 2200, unit: 'kcal' },
    protein: { current: 120, target: 180, unit: 'g' },
    carbs: { current: 140, target: 220, unit: 'g' },
    fats: { current: 45, target: 75, unit: 'g' }
  }

  const demoWeightData = [
    { date: '2024-01-01', weight: 85 },
    { date: '2024-01-08', weight: 84.2 },
    { date: '2024-01-15', weight: 83.5 },
    { date: '2024-01-22', weight: 82.8 },
    { date: '2024-01-29', weight: 82.1 },
    { date: '2024-02-05', weight: 81.5 },
  ]

  const demoFoodData = {
    calories: [{ name: 'Oatmeal & Berries', amount: 350, unit: 'kcal' }, { name: 'Grilled Chicken Salad', amount: 450, unit: 'kcal' }],
    protein: [{ name: 'Chicken Breast', amount: 35, unit: 'g' }, { name: 'Greek Yogurt', amount: 15, unit: 'g' }],
    carbs: [{ name: 'Oats', amount: 45, unit: 'g' }, { name: 'Banana', amount: 25, unit: 'g' }],
    fats: [{ name: 'Almonds', amount: 12, unit: 'g' }, { name: 'Avocado', amount: 10, unit: 'g' }]
  }

  const demoNextWorkout = {
    name: 'Push Day (Example)',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: '80 kg' },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: '50 kg' },
      { name: 'Incline DB Press', sets: 3, reps: 12, weight: '24 kg' }
    ]
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const dateStr = new Date().toISOString().split('T')[0]

        let hasData = false;

        // 1. Fetch Macros & Goals
        const [goals, daily] = await Promise.all([
          getUserMacroGoals(supabase),
          getDailyNutrition(supabase, dateStr)
        ])

        if (goals) {
          setMacros(prev => ({
            calories: { ...prev.calories, target: goals.calories },
            protein: { ...prev.protein, target: goals.protein },
            carbs: { ...prev.carbs, target: goals.carbs },
            fats: { ...prev.fats, target: goals.fats }
          }))
        }

        if (daily) {
          if (daily.total_calories > 0 || daily.total_protein > 0 || daily.total_carbs > 0 || daily.total_fats > 0) hasData = true;
          setMacros(prev => ({
            calories: { ...prev.calories, current: daily.total_calories },
            protein: { ...prev.protein, current: daily.total_protein },
            carbs: { ...prev.carbs, current: daily.total_carbs },
            fats: { ...prev.fats, current: daily.total_fats }
          }))
        }

        // 2. Fetch Weight History
        const weightHistory = await getWeightHistory(supabase)
        if (weightHistory.length > 0) hasData = true;
        setWeightData(weightHistory)

        // 3. Fetch Food Logs for detailed breakdown
        const logs = await getFoodLogs(supabase, dateStr)
        const processedFoodData = {
          calories: logs.map(l => ({ name: l.food_name, amount: l.calories, unit: 'kcal' })),
          protein: logs.map(l => ({ name: l.food_name, amount: l.protein, unit: 'g' })),
          carbs: logs.map(l => ({ name: l.food_name, amount: l.carbs, unit: 'g' })),
          fats: logs.map(l => ({ name: l.fats, amount: l.fats, unit: 'g' }))
        }
        setFoodData(processedFoodData)

        // 4. Fetch Workouts
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 1)
        const toDate = new Date()
        toDate.setDate(toDate.getDate() + 7)
        const workouts = await getWorkouts(supabase, fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0])

        if (workouts.length > 0) hasData = true;

        // Format for calendar
        const formattedWorkouts = workouts.map(w => ({
          date: w.date,
          splitType: w.name || 'Workout',
          exercises: w.exercises.map(e => ({
            name: e.name,
            sets: e.sets.map(s => ({ reps: s.reps, weight: s.weight })),
            progressiveOverload: false
          }))
        }))
        setWorkoutData(formattedWorkouts)

        // Determine "Next Workout" or "Latest Workout"
        // Simple logic: if today has workout, show it. Else show latest.
        const todayWorkout = workouts.find(w => w.date === dateStr)
        const displayWorkout = todayWorkout || workouts[0]

        if (displayWorkout) {
          setNextWorkout({
            name: displayWorkout.name || 'Latest Workout',
            exercises: displayWorkout.exercises.map(e => ({
              name: e.name,
              sets: e.sets.length,
              reps: e.sets[0]?.reps || 0,
              weight: `${e.sets[0]?.weight} kg`
            }))
          })
        }

        // If no data found at all, enable Demo Mode
        setIsDemoMode(!hasData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  // Determine what to display
  const displayMacros = isDemoMode ? demoMacros : macros
  const displayWeightData = isDemoMode ? demoWeightData : weightData
  const displayWorkoutData = isDemoMode ? mockWorkoutData : workoutData
  const displayNextWorkout = isDemoMode ? demoNextWorkout : nextWorkout

  // For macros, we also need list of foods for the card, which is foodData
  const displayFoodData = isDemoMode ? demoFoodData : foodData

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#171717] to-[#1E1E1E] -z-10">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,#4ADE80,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_80%,#60A5FA,transparent_50%)]"></div>
      </div>
      <div className="pt-16">
        <div className="relative z-10">
          <main className="container mx-auto px-4 py-8">

            {/* Get Started Banner (Only in Demo Mode) */}
            {isDemoMode && (
              <div className="mb-10 bg-gradient-to-r from-[#1F2937] to-[#111827] border border-[#374151] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DumbbellIcon size={120} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-[#60A5FA] to-[#4ADE80] bg-clip-text text-transparent">
                    Welcome to your new dashboard!
                  </h2>
                  <p className="text-[#9CA3AF] mb-6 max-w-lg text-lg">
                    You're seeing example data right now. Start logging your meals and workouts to replace this with your own progress.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/macrotracker">
                      <button className="flex items-center bg-[#4ADE80] hover:bg-[#22C55E] text-black font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/20">
                        <FlameIcon className="mr-2 h-5 w-5" />
                        Log First Meal
                      </button>
                    </Link>
                    <Link href="/workout">
                      <button className="flex items-center bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
                        <DumbbellIcon className="mr-2 h-5 w-5" />
                        Log Workout
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Daily Progress {isDemoMode && <span className="text-sm font-normal text-[#60A5FA] ml-2 bg-[#60A5FA]/10 px-2 py-1 rounded border border-[#60A5FA]/20">Demo Mode</span>}
              </h1>
              <div className="mt-2 md:mt-0 flex items-center space-x-2 text-[#A1A1AA] text-sm">
                <TimerIcon className="h-4 w-4" />
                <span>Last updated: Just now</span>
              </div>
            </div>

            {/* Macros Section */}
            <section className="mb-8">
              <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
                Today's Macros
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MacroCard
                  title="Calories"
                  current={displayMacros.calories.current}
                  target={displayMacros.calories.target}
                  unit={displayMacros.calories.unit}
                  icon={<FlameIcon className="h-5 w-5" />}
                  color="from-[#4ADE80] to-[#22C55E]"
                  foods={displayFoodData.calories}
                />
                <MacroCard
                  title="Protein"
                  current={displayMacros.protein.current}
                  target={displayMacros.protein.target}
                  unit={displayMacros.protein.unit}
                  icon={<BarChartIcon className="h-5 w-5" />}
                  color="from-[#60A5FA] to-[#3B82F6]"
                  foods={displayFoodData.protein}
                />
                <MacroCard
                  title="Carbs"
                  current={displayMacros.carbs.current}
                  target={displayMacros.carbs.target}
                  unit={displayMacros.carbs.unit}
                  icon={<BarChartIcon className="h-5 w-5" />}
                  color="from-[#F472B6] to-[#EC4899]"
                  foods={displayFoodData.carbs}
                />
                <MacroCard
                  title="Fats"
                  current={displayMacros.fats.current}
                  target={displayMacros.fats.target}
                  unit={displayMacros.fats.unit}
                  icon={<BarChartIcon className="h-5 w-5" />}
                  color="from-[#FB923C] to-[#F97316]"
                  foods={displayFoodData.fats}
                />
              </div>
            </section>

            {/* Weight Progress */}
            <section className="mb-8">
              <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
                Weight Progress
              </h2>
              <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-[#333]/50">
                <BodyWeightGraph data={displayWeightData} />
                <div className="mt-4 p-4 bg-[#252525] rounded-lg">
                  <p className="text-sm text-[#A1A1AA]">
                    <span className="text-[#4ADE80] font-medium">
                      Consistency is key!
                    </span>{' '}
                    Track your weight regularly to see trends over time.
                  </p>
                </div>
              </div>
            </section>

            {/* Motivational Text */}
            <MotivationalText percentage={Math.min(100, Math.round((displayMacros.protein.current / displayMacros.protein.target) * 100)) || 0} nutrient="protein" />

            {/* Calendar and Next Workout side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div>
                {/* Calendar Section */}
                <section>
                  <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
                    Workout Calendar
                  </h2>
                  <div className="transform origin-top-left bg-[#1E1E1E] rounded-xl p-2 shadow-lg border border-[#333]/50">
                    <Calendar workoutData={displayWorkoutData} splitColors={splitColors} />
                  </div>
                </section>
              </div>

              <div>
                {/* Next Workout */}
                <section>
                  <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
                    Next up
                  </h2>
                  {displayNextWorkout ? (
                    <WorkoutCard workout={displayNextWorkout} />
                  ) : (
                    <div className="bg-[#1E1E1E] rounded-xl p-10 shadow-lg text-center text-[#A1A1AA] border border-[#333]/50 flex flex-col items-center justify-center h-full min-h-[300px]">
                      <DumbbellIcon size={48} className="mb-4 opacity-20" />
                      <p className="text-lg">No upcoming workout scheduled</p>
                      <Link href="/workout">
                        <button className="mt-4 text-[#60A5FA] hover:underline flex items-center">
                          Schedule one now <ArrowRightIcon size={16} className="ml-1" />
                        </button>
                      </Link>
                    </div>
                  )}
                </section>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
