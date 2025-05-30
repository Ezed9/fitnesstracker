import React from 'react'
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react'
interface Exercise {
  id: number
  name: string
  lastSession: {
    sets: number
    reps: number
    weight: number
  }
  suggestion: {
    type: 'weight' | 'reps'
    value: number
    message: string
  }
}
interface ProgressiveOverloadProps {
  exercises: Exercise[]
}
export const ProgressiveOverload: React.FC<ProgressiveOverloadProps> = ({
  exercises,
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-[#4ADE80]" />
        <h2 className="text-xl font-semibold">Progressive Overload</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-[#1E1E1E] p-4 rounded-xl">
            <h3 className="font-medium mb-2">{exercise.name}</h3>
            <div className="text-sm text-gray-400 mb-3">
              Last session: {exercise.lastSession.sets}×
              {exercise.lastSession.reps} at {exercise.lastSession.weight}kg
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[#4ADE80] font-medium">
                Suggested: {exercise.suggestion.message}
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
