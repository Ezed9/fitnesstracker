import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}
interface DailySummaryProps {
  consumed: MacroGoals
  goals: MacroGoals
}
export const DailySummary: React.FC<DailySummaryProps> = ({
  consumed,
  goals,
}) => {
  const macros = [
    {
      name: 'Calories',
      value: consumed.calories,
      goal: goals.calories,
      color: '#4ADE80',
      unit: 'kcal',
    },
    {
      name: 'Protein',
      value: consumed.protein,
      goal: goals.protein,
      color: '#60A5FA',
      unit: 'g',
    },
    {
      name: 'Carbs',
      value: consumed.carbs,
      goal: goals.carbs,
      color: '#F472B6',
      unit: 'g',
    },
    {
      name: 'Fat',
      value: consumed.fat,
      goal: goals.fat,
      color: '#FBBF24',
      unit: 'g',
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {macros.map((macro) => (
        <div
          key={macro.name}
          className="bg-[#1E1E1E] p-4 rounded-xl shadow-sm flex flex-col items-center"
        >
          <div className="w-24 h-24 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Consumed',
                      value: macro.value,
                    },
                    {
                      name: 'Remaining',
                      value: Math.max(0, macro.goal - macro.value),
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  <Cell fill={macro.color} />
                  <Cell fill="#333333" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <h3 className="font-medium text-gray-300">{macro.name}</h3>
          <p className="text-xl font-bold">
            {macro.value}
            <span className="text-sm font-normal text-gray-400 ml-1">
              {macro.unit}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            {Math.round((macro.value / macro.goal) * 100)}% of {macro.goal}
            {macro.unit}
          </p>
        </div>
      ))}
    </div>
  )
}
