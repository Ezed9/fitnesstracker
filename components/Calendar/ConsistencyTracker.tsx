import React from 'react'
import { TrendingUpIcon } from 'lucide-react'

interface ConsistencyTrackerProps {
  weeklyWorkouts: number
  monthlyWorkouts: number
  longestStreak: number
}

const ConsistencyTracker: React.FC<ConsistencyTrackerProps> = ({
  weeklyWorkouts,
  monthlyWorkouts,
  longestStreak,
}) => {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <TrendingUpIcon size={16} className="mr-1" />
        Consistency Tracker
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#262626] p-3 rounded-md">
          <div className="text-xs text-gray-400">This Week</div>
          <div className="text-lg font-semibold">{weeklyWorkouts}/7</div>
          <div className="text-xs text-gray-400">days</div>
        </div>
        <div className="bg-[#262626] p-3 rounded-md">
          <div className="text-xs text-gray-400">This Month</div>
          <div className="text-lg font-semibold">{monthlyWorkouts}</div>
          <div className="text-xs text-gray-400">workouts</div>
        </div>
        <div className="bg-[#262626] p-3 rounded-md">
          <div className="text-xs text-gray-400">Longest Streak</div>
          <div className="text-lg font-semibold">{longestStreak}</div>
          <div className="text-xs text-gray-400">days</div>
        </div>
      </div>
      <div className="mt-3 text-center text-sm text-gray-400">
        {weeklyWorkouts >= 5
          ? "You're on fire! Keep up the great work!"
          : weeklyWorkouts >= 3
            ? "You've been consistent this week. Keep it up!"
            : "Let's get moving! You can do this!"}
      </div>
    </div>
  )
}

export default ConsistencyTracker
