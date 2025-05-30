import React from 'react'
interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}
interface GoalBreakdownProps {
  consumed: MacroGoals
  goals: MacroGoals
}
export const GoalBreakdown: React.FC<GoalBreakdownProps> = ({
  consumed,
  goals,
}) => {
  const macroDetails = [
    {
      name: 'Calories',
      consumed: consumed.calories,
      goal: goals.calories,
      color: '#4ADE80',
      unit: 'kcal',
    },
    {
      name: 'Protein',
      consumed: consumed.protein,
      goal: goals.protein,
      color: '#60A5FA',
      unit: 'g',
    },
    {
      name: 'Carbs',
      consumed: consumed.carbs,
      goal: goals.carbs,
      color: '#F472B6',
      unit: 'g',
    },
    {
      name: 'Fat',
      consumed: consumed.fat,
      goal: goals.fat,
      color: '#FBBF24',
      unit: 'g',
    },
  ]
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Daily Goals Breakdown</h2>
      <div className="space-y-4">
        {macroDetails.map((macro) => {
          const remaining = Math.max(0, macro.goal - macro.consumed)
          const percentage = Math.min(
            100,
            Math.round((macro.consumed / macro.goal) * 100),
          )
          return (
            <div key={macro.name}>
              <div className="flex justify-between mb-1 items-center">
                <span className="text-sm font-medium">{macro.name}</span>
                <span className="text-sm text-gray-300">
                  {macro.consumed} / {macro.goal}
                  {macro.unit}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: macro.color,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>
                  Consumed: {macro.consumed}
                  {macro.unit}
                </span>
                <span>
                  Remaining: {remaining}
                  {macro.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
