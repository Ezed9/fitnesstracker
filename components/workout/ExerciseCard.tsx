import React from 'react'
import { ChevronUp, PlusCircle, Trophy } from 'lucide-react'
interface Set {
  reps: number
  weight: number
  completed: boolean
}
interface Exercise {
  id: number
  name: string
  sets: Set[]
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
interface ExerciseCardProps {
  exercise: Exercise
}
export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{exercise.name}</h3>
        <div className="bg-[#4ADE80]/10 text-[#4ADE80] px-3 py-1 rounded-full text-sm font-medium">
          {exercise.suggestion.message}
        </div>
      </div>
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#252525] p-3 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Set {index + 1}</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={set.reps}
                  className="w-16 bg-[#1E1E1E] border border-gray-700 rounded px-2 py-1 text-center"
                />
                <span className="text-gray-400">×</span>
                <input
                  type="number"
                  value={set.weight}
                  className="w-16 bg-[#1E1E1E] border border-gray-700 rounded px-2 py-1 text-center"
                />
                <span className="text-gray-400">kg</span>
              </div>
            </div>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${set.completed ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-gray-700 text-white'}`}
            >
              {set.completed ? 'Done' : 'Log'}
            </button>
          </div>
        ))}
        <button className="flex items-center justify-center w-full py-2 text-[#60A5FA] hover:text-blue-400 transition-colors">
          <PlusCircle className="w-5 h-5 mr-1" />
          Add Set
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center text-sm text-gray-400">
          <Trophy className="w-4 h-4 mr-2" />
          Last session: {exercise.lastSession.sets} sets of{' '}
          {exercise.lastSession.reps} at {exercise.lastSession.weight}kg
        </div>
      </div>
    </div>
  )
}
