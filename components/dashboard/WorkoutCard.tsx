import React from 'react'
import { DumbbellIcon, ClockIcon } from 'lucide-react'

interface Exercise {
  name: string
  sets: number
  reps: string
  weight: string
}

interface WorkoutProps {
  workout: {
    name: string
    exercises: Exercise[]
  }
}

export function WorkoutCard({ workout }: WorkoutProps) {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-[#60A5FA] via-transparent to-transparent"></div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center mr-3">
            <DumbbellIcon className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <h3 className="text-lg font-medium">{workout.name}</h3>
        </div>
        <div className="flex items-center text-[#A1A1AA] text-sm bg-[#252525] px-3 py-1 rounded-full">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>45 min</span>
        </div>
      </div>
      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => (
          <div
            key={index}
            className="border-b border-[#333333] pb-4 last:border-0 last:pb-0 hover:bg-[#252525] -mx-6 px-6 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{exercise.name}</h4>
              <span className="text-sm bg-[#252525] px-2 py-0.5 rounded text-[#A1A1AA]">
                {exercise.weight}
              </span>
            </div>
            <div className="text-sm text-[#A1A1AA] mt-1">
              {exercise.sets} sets × {exercise.reps} reps
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#2563EB] transition-all duration-300 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center shadow-lg shadow-blue-500/20">
        <DumbbellIcon className="h-5 w-5 mr-2" />
        Start Workout
      </button>
    </div>
  )
}
