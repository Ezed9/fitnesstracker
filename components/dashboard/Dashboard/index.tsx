import React from 'react'
import { BarChartIcon, DumbbellIcon, TimerIcon, FlameIcon } from 'lucide-react'
import { MacroCard } from '../MacroCard'
import { WorkoutCard } from '../WorkoutCard'
import { MotivationalText } from '../MotivationalText'
import { BodyWeightGraph } from '../BodyWeightGraph'

export default function Dashboard() {
  // Sample data - in a real app this would come from API or state management
  const macros = {
    calories: {
      current: 1450,
      target: 2000,
      unit: 'kcal',
    },
    protein: {
      current: 120,
      target: 150,
      unit: 'g',
    },
    carbs: {
      current: 140,
      target: 200,
      unit: 'g',
    },
    fats: {
      current: 45,
      target: 70,
      unit: 'g',
    },
  }

  const weightData = [
    {
      date: '2024-01-01',
      weight: 185,
    },
    {
      date: '2024-01-08',
      weight: 183,
    },
    {
      date: '2024-01-15',
      weight: 182,
    },
    {
      date: '2024-01-22',
      weight: 180,
    },
    {
      date: '2024-01-29',
      weight: 179,
    },
    {
      date: '2024-02-05',
      weight: 178,
    },
    {
      date: '2024-02-12',
      weight: 177,
    },
  ]

  const foodData = {
    calories: [
      {
        name: 'Grilled Chicken Breast',
        amount: 350,
        unit: 'kcal',
      },
      {
        name: 'Brown Rice',
        amount: 250,
        unit: 'kcal',
      },
      {
        name: 'Mixed Vegetables',
        amount: 150,
        unit: 'kcal',
      },
      {
        name: 'Protein Shake',
        amount: 200,
        unit: 'kcal',
      },
      {
        name: 'Greek Yogurt',
        amount: 150,
        unit: 'kcal',
      },
      {
        name: 'Almonds',
        amount: 350,
        unit: 'kcal',
      },
    ],
    protein: [
      {
        name: 'Grilled Chicken Breast',
        amount: 32,
        unit: 'g',
      },
      {
        name: 'Protein Shake',
        amount: 25,
        unit: 'g',
      },
      {
        name: 'Greek Yogurt',
        amount: 15,
        unit: 'g',
      },
      {
        name: 'Brown Rice',
        amount: 5,
        unit: 'g',
      },
    ],
    carbs: [
      {
        name: 'Brown Rice',
        amount: 45,
        unit: 'g',
      },
      {
        name: 'Mixed Vegetables',
        amount: 30,
        unit: 'g',
      },
      {
        name: 'Protein Shake',
        amount: 15,
        unit: 'g',
      },
      {
        name: 'Greek Yogurt',
        amount: 10,
        unit: 'g',
      },
    ],
    fats: [
      {
        name: 'Almonds',
        amount: 15,
        unit: 'g',
      },
      {
        name: 'Greek Yogurt',
        amount: 8,
        unit: 'g',
      },
      {
        name: 'Grilled Chicken Breast',
        amount: 7,
        unit: 'g',
      },
    ],
  }

  const nextWorkout = {
    name: 'Upper Body Strength',
    exercises: [
      {
        name: 'Bench Press',
        sets: 4,
        reps: '8-10',
        weight: '135 lbs',
      },
      {
        name: 'Pull-ups',
        sets: 3,
        reps: '8-12',
        weight: 'Body weight',
      },
      {
        name: 'Shoulder Press',
        sets: 3,
        reps: '10-12',
        weight: '50 lbs',
      },
      {
        name: 'Bicep Curls',
        sets: 3,
        reps: '12-15',
        weight: '30 lbs',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#171717] to-[#1E1E1E] -z-10">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_-20%,#4ADE80,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_80%,#60A5FA,transparent_50%)]"></div>
      </div>
      <div className="pt-16">
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Daily Progress
            </h1>
            <div className="mt-2 md:mt-0 flex items-center space-x-2 text-[#A1A1AA] text-sm">
              <TimerIcon className="h-4 w-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
              Today's Macros
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <MacroCard
                title="Calories"
                current={macros.calories.current}
                target={macros.calories.target}
                unit={macros.calories.unit}
                icon={<FlameIcon className="h-5 w-5" />}
                color="from-[#4ADE80] to-[#22C55E]"
                foods={foodData.calories}
              />
              <MacroCard
                title="Protein"
                current={macros.protein.current}
                target={macros.protein.target}
                unit={macros.protein.unit}
                icon={<BarChartIcon className="h-5 w-5" />}
                color="from-[#60A5FA] to-[#3B82F6]"
                foods={foodData.protein}
              />
              <MacroCard
                title="Carbs"
                current={macros.carbs.current}
                target={macros.carbs.target}
                unit={macros.carbs.unit}
                icon={<BarChartIcon className="h-5 w-5" />}
                color="from-[#F472B6] to-[#EC4899]"
                foods={foodData.carbs}
              />
              <MacroCard
                title="Fats"
                current={macros.fats.current}
                target={macros.fats.target}
                unit={macros.fats.unit}
                icon={<BarChartIcon className="h-5 w-5" />}
                color="from-[#FB923C] to-[#F97316]"
                foods={foodData.fats}
              />
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
              Weight Progress
            </h2>
            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
              <BodyWeightGraph data={weightData} />
              <div className="mt-4 p-4 bg-[#252525] rounded-lg">
                <p className="text-sm text-[#A1A1AA]">
                  <span className="text-[#4ADE80] font-medium">
                    Great progress!
                  </span>{' '}
                  You've lost 8 lbs in the last 6 weeks. Keep up the consistent
                  weight loss of 1-2 lbs per week for healthy, sustainable
                  results.
                </p>
              </div>
            </div>
          </section>
          <MotivationalText percentage={80} nutrient="protein" />
          <section className="mt-8">
            <h2 className="text-xl font-medium mb-4 text-[#A1A1AA]">
              Next Workout
            </h2>
            <WorkoutCard workout={nextWorkout} />
          </section>
        </main>
      </div>
      </div>
    </div>
  )
}
