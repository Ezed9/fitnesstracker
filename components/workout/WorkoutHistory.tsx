import React from 'react'
import { Clock, ChevronDown, ChevronUp } from 'lucide-react'
interface WorkoutHistoryProps {
  isExpanded: boolean
  onToggle: () => void
}
export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({
  isExpanded,
  onToggle,
}) => {
  const history = [
    {
      date: '2024-01-15',
      split: 'Leg Day',
      exercises: ['Squat', 'Romanian Deadlift', 'Leg Press'],
    },
    {
      date: '2024-01-13',
      split: 'Push Day',
      exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extension'],
    },
    {
      date: '2024-01-11',
      split: 'Pull Day',
      exercises: ['Deadlift', 'Barbell Row', 'Pull-ups'],
    },
  ]
  return (
    <div className="bg-[#1E1E1E] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#60A5FA]" />
          <h2 className="text-lg font-semibold">Workout History</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-5 pb-4">
          <div className="space-y-4">
            {history.map((workout) => (
              <div
                key={workout.date}
                className="border-l-2 border-gray-700 pl-4 py-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">
                    {new Date(workout.date).toLocaleDateString()}
                  </span>
                  <span className="text-[#60A5FA] font-medium">
                    {workout.split}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  {workout.exercises.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
