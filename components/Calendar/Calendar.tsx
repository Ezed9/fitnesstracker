import React, { useState } from 'react'
import CalendarDay from '@/components/Calendar/CalendarDay'
import CalendarLegend from '@/components/Calendar/CalendarLegend'
import ConsistencyTracker from '@/components/Calendar/ConsistencyTracker'
import { Workout, SplitColors } from '@/components/mockData'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

interface CalendarProps {
  workoutData: Workout[]
  splitColors: SplitColors
}

const Calendar: React.FC<CalendarProps> = ({ workoutData, splitColors }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const calendarDays = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split('T')[0]
      const workout = workoutData.find((w) => w.date === dateString)
      calendarDays.push({
        day,
        date: dateString,
        workout,
      })
    }

    return calendarDays
  }

  const days = getMonthDays()

  // Calculate stats for the consistency tracker
  const currentMonthWorkouts = workoutData.filter((workout) => {
    const workoutDate = new Date(workout.date)
    return (
      workoutDate.getMonth() === currentDate.getMonth() &&
      workoutDate.getFullYear() === currentDate.getFullYear()
    )
  })

  const currentWeekWorkouts = workoutData.filter((workout) => {
    const workoutDate = new Date(workout.date)
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    return workoutDate >= startOfWeek && workoutDate < endOfWeek
  })

  // Calculate longest streak
  const calculateLongestStreak = () => {
    // Sort workouts by date
    const sortedWorkouts = [...workoutData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    let currentStreak = 1
    let longestStreak = 1
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDate = new Date(sortedWorkouts[i - 1].date)
      const currDate = new Date(sortedWorkouts[i].date)
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    return longestStreak
  }

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowRightIcon size={20} />
        </button>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayInfo, index) => (
          <CalendarDay
            key={index}
            dayInfo={dayInfo}
            splitColors={splitColors}
            onSelectWorkout={setSelectedWorkout}
            selectedWorkout={selectedWorkout}
          />
        ))}
      </div>

      {/* Legend */}
      <CalendarLegend splitColors={splitColors} />

      {/* Consistency Tracker */}
      <ConsistencyTracker
        weeklyWorkouts={currentWeekWorkouts.length}
        monthlyWorkouts={currentMonthWorkouts.length}
        longestStreak={calculateLongestStreak()}
      />
    </div>
  )
}

export default Calendar
