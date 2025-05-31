import React, { useState } from 'react'
import { Workout, SplitColors } from '@/components/mockData'
import WorkoutDetails from '@/components/Calendar/WorkoutDetails'

interface DayInfo {
  day?: number
  date?: string
  workout?: Workout
}

interface CalendarDayProps {
  dayInfo: DayInfo | null
  splitColors: SplitColors
  onSelectWorkout: (workout: Workout | null) => void
  selectedWorkout: Workout | null
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  dayInfo,
  splitColors,
  onSelectWorkout,
  selectedWorkout,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!dayInfo) {
    return <div className="h-24 bg-[#262626] rounded-md opacity-50"></div>
  }

  const isToday = dayInfo.date === new Date().toISOString().split('T')[0]
  const isSelected =
    selectedWorkout &&
    dayInfo.workout &&
    selectedWorkout.date === dayInfo.workout.date

  const handleDayClick = () => {
    if (dayInfo.workout) {
      onSelectWorkout(dayInfo.workout)
      setShowTooltip(true)
    } else {
      onSelectWorkout(null)
      setShowTooltip(false)
    }
  }

  return (
    <div
      className={`h-24 bg-[#262626] rounded-md p-2 relative cursor-pointer transition-all ${isToday ? 'ring-2 ring-white' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''} hover:bg-[#303030]`}
      onClick={handleDayClick}
    >
      <div className="text-sm mb-1">{dayInfo.day}</div>
      {dayInfo.workout && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div
            className="h-2 w-2/3 rounded-full"
            style={{
              backgroundColor:
                splitColors[dayInfo.workout.splitType] || '#A1A1AA',
            }}
          ></div>
        </div>
      )}
      {showTooltip && isSelected && dayInfo.workout && (
        <WorkoutDetails
          workout={dayInfo.workout}
          onClose={() => {
            setShowTooltip(false)
            onSelectWorkout(null)
          }}
        />
      )}
    </div>
  )
}

export default CalendarDay
