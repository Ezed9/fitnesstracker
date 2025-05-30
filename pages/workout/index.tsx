import React, { useState, useEffect } from 'react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { WorkoutHeader } from '@/components/workout/WorkoutHeader'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { ProgressiveOverload } from '@/components/workout/ProgressiveOverload'
import { WorkoutHistory } from '@/components/workout/WorkoutHistory'
import { FloatingActionButton } from '@/components/workout/FloatingActionButton'

const workoutLog: {
  [date: string]: {
    split: string
    exercises: string[]
  }
} = {
  '2025-05-02': {
    split: 'Leg Day',
    exercises: ['Barbell Squat', 'Leg Press', 'Romanian Deadlift'],
  },
  '2025-05-04': {
    split: 'Back Day',
    exercises: ['Pull Ups', 'Barbell Row', 'Lat Pulldown'],
  },
  // Add more days as needed...
}

const Calendar = ({ workoutLog }: { workoutLog: Record<string, { split: string, exercises: string[] }> }) => {
  const today = new Date()
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([])

  useEffect(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const days: Date[] = []
    for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    setDaysInMonth(days)
  }, [])

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`

  return (
    <div className="mb-6">
      <h2 className="text-white text-xl font-semibold mb-1">Workout Calendar</h2>
      <h3 className="text-[#FFFFFF] text-lg font-semibold mb-2">
        {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-[#A1A1AA]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
          <div key={d} className="font-medium">{d}</div>
        ))}
        {daysInMonth.map((day) => {
          const dateStr = formatDate(day)
          const log = workoutLog[dateStr]

          return (
            <div key={dateStr} className="relative group">
              <div
                className={`rounded-xl p-2 transition-colors ${log
                    ? 'bg-[#4ADE80] text-black font-semibold'
                    : 'bg-[#1E1E1E] text-[#A1A1AA]'
                  }`}
              >
                {day.getDate()}
              </div>

              {log && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1E1E1E] text-white text-xs rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="font-bold text-[#60A5FA] mb-1">{log.split}</div>
                  <ul className="list-disc list-inside space-y-1 text-[#A1A1AA]">
                    {log.exercises.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Workout() {
  // Sample workout data
  const workoutData = {
    split: 'Leg Day',
    exercises: [
      {
        id: 1,
        name: 'Barbell Squat',
        sets: [
          {
            reps: 12,
            weight: 60,
            completed: true,
          },
          {
            reps: 12,
            weight: 60,
            completed: true,
          },
          {
            reps: 12,
            weight: 60,
            completed: false,
          },
        ],
        lastSession: {
          sets: 3,
          reps: 12,
          weight: 60,
        },
        suggestion: {
          type: 'weight' as 'weight',
          value: 2.5,
          message: 'Try +2.5kg today',
        },
      },
      {
        id: 2,
        name: 'Romanian Deadlift',
        sets: [
          {
            reps: 12,
            weight: 80,
            completed: true,
          },
          {
            reps: 12,
            weight: 80,
            completed: false,
          },
          {
            reps: 12,
            weight: 80,
            completed: false,
          },
        ],
        lastSession: {
          sets: 3,
          reps: 12,
          weight: 80,
        },
        suggestion: {
          type: 'reps' as 'reps',
          value: 1,
          message: 'Add 1 rep per set',
        },
      },
      {
        id: 3,
        name: 'Leg Press',
        sets: [
          {
            reps: 15,
            weight: 120,
            completed: true,
          },
          {
            reps: 15,
            weight: 120,
            completed: false,
          },
          {
            reps: 15,
            weight: 120,
            completed: false,
          },
        ],
        lastSession: {
          sets: 3,
          reps: 15,
          weight: 120,
        },
        suggestion: {
          type: 'weight' as 'weight',
          value: 5,
          message: 'Try +5kg today',
        },
      },
    ],
  }
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  // ✅ Example: Dates you worked out this month
  const workedOutDates = [
    '2025-05-02',
    '2025-05-04',
    '2025-05-06',
    '2025-05-08',
    '2025-05-10',
  ]

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-6 max-w-3xl pb-24">
        <Calendar workoutLog={workoutLog} />
        <WorkoutHeader split={workoutData.split} />
        <div className="mt-8 space-y-6">
          {workoutData.exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
        <div className="mt-12">
          <ProgressiveOverload exercises={workoutData.exercises} />
        </div>
        <div className="mt-8">
          <WorkoutHistory
            isExpanded={isHistoryExpanded}
            onToggle={() => setIsHistoryExpanded(!isHistoryExpanded)}
          />
        </div>
      </div>
      <FloatingActionButton />
    </AuthWrapper>
  )
}
