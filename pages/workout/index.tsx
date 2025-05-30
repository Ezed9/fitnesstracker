import React, { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { WorkoutHeader } from '@/components/workout/WorkoutHeader'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { ProgressiveOverload } from '@/components/workout/ProgressiveOverload'
import { WorkoutHistory } from '@/components/workout/WorkoutHistory'
import { FloatingActionButton } from '@/components/workout/FloatingActionButton'

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
  
  return (
    <AuthWrapper>
        <div className="container mx-auto px-4 py-6 max-w-3xl pb-24">
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
