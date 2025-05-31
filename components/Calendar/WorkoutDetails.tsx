import React from 'react'
import { Workout, WorkoutExercise } from '@/components/mockData'
import { ArrowUpIcon, XIcon } from 'lucide-react'

interface WorkoutDetailsProps {
  workout: Workout
  onClose: () => void
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({
  workout,
  onClose,
}) => {
  return (
    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[#262626] rounded-md shadow-lg p-3 text-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{workout.splitType} Workout</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XIcon size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {workout.exercises.map((exercise: WorkoutExercise, idx: number) => (
          <div key={idx} className="border-t border-gray-700 pt-2">
            <div className="flex items-center">
              <span className="font-medium">{exercise.name}</span>
              {exercise.progressiveOverload && (
                <span
                  className="ml-2 text-green-400"
                  title="Progressive Overload"
                >
                  <ArrowUpIcon size={14} />
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {exercise.sets.map((set: { reps: number, weight: number }, setIdx: number) => (
                <div key={setIdx} className="flex justify-between">
                  <span>Set {setIdx + 1}</span>
                  <span>
                    {set.reps} reps × {set.weight} lbs
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#262626]"></div>
    </div>
  )
}

export default WorkoutDetails
