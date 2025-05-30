import React from 'react'
interface MacroGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}
interface MotivationalTextProps {
  consumed: MacroGoals
  goals: MacroGoals
}
export const MotivationalText: React.FC<MotivationalTextProps> = ({
  consumed,
  goals,
}) => {
  const getMotivationalText = () => {
    const proteinPercentage = (consumed.protein / goals.protein) * 100
    if (proteinPercentage >= 90) {
      return "You're crushing your protein goal today!"
    } else if (proteinPercentage >= 75) {
      return "Keep it up! You're making great progress on your macros!"
    } else if (proteinPercentage >= 50) {
      return "You're on the right track with your nutrition today!"
    } else {
      return 'Every bite counts! Keep focusing on your nutrition goals!'
    }
  }
  return (
    <div className="mt-6 bg-gradient-to-r from-[#1E1E1E] to-[#252525] p-4 rounded-xl border-l-4 border-[#4ADE80]">
      <p className="text-lg font-medium">{getMotivationalText()}</p>
    </div>
  )
}
