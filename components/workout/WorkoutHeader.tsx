import React from 'react'
import { Dumbbell } from 'lucide-react'
interface WorkoutHeaderProps {
  split: string
}
export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ split }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Dumbbell className="w-6 h-6 mr-2 text-[#4ADE80]" />
          Today's Workout
        </h1>
        <span className="text-[#60A5FA] font-semibold">{split}</span>
      </div>
      <div className="bg-gradient-to-r from-[#1E1E1E] to-[#252525] p-4 rounded-xl border-l-4 border-[#4ADE80]">
        <p className="text-lg font-medium">
          Crush your {split.toLowerCase()} today! 💪
        </p>
      </div>
    </div>
  )
}
