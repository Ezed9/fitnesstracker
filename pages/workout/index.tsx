import React, { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { WorkoutHeader } from '@/components/workout/WorkoutHeader'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { ProgressiveOverload } from '@/components/workout/ProgressiveOverload'
import { WorkoutHistory } from '@/components/workout/WorkoutHistory'
import { FloatingActionButton } from '@/components/workout/FloatingActionButton'
import Calendar from '@/components/Calendar/Calendar'
import { type Workout, type WorkoutExercise, splitColors } from '@/components/mockData'



export default function Workout() {
  // Sample workout data for current view
  const currentWorkout = {
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

  // Create calendar-compatible workout data format
  const calendarWorkouts: Workout[] = [
    {
      date: '2025-05-02',
      splitType: 'Legs',
      exercises: [
        {
          name: 'Barbell Squat',
          sets: [
            { reps: 12, weight: 60 },
            { reps: 12, weight: 60 },
            { reps: 10, weight: 65 },
          ],
          progressiveOverload: true,
        },
        {
          name: 'Leg Press',
          sets: [
            { reps: 12, weight: 100 },
            { reps: 10, weight: 120 },
            { reps: 8, weight: 140 },
          ],
        },
      ],
    },
    {
      date: '2025-05-04',
      splitType: 'Pull',
      exercises: [
        {
          name: 'Pull Ups',
          sets: [
            { reps: 8, weight: 0 },
            { reps: 8, weight: 0 },
            { reps: 6, weight: 0 },
          ],
        },
        {
          name: 'Barbell Row',
          sets: [
            { reps: 10, weight: 60 },
            { reps: 10, weight: 65 },
            { reps: 8, weight: 70 },
          ],
          progressiveOverload: true,
        },
      ],
    },
    {
      date: '2025-05-06',
      splitType: 'Push',
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { reps: 10, weight: 70 },
            { reps: 8, weight: 80 },
            { reps: 6, weight: 90 },
          ],
          progressiveOverload: true,
        },
      ],
    },
    {
      date: '2025-05-08',
      splitType: 'Legs',
      exercises: [
        {
          name: 'Squat',
          sets: [
            { reps: 10, weight: 70 },
            { reps: 8, weight: 80 },
            { reps: 6, weight: 90 },
          ],
        },
      ],
    },
    {
      date: '2025-05-10',
      splitType: 'Push',
      exercises: [
        {
          name: 'Shoulder Press',
          sets: [
            { reps: 10, weight: 40 },
            { reps: 8, weight: 45 },
            { reps: 6, weight: 50 },
          ],
        },
      ],
    },
  ]

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-6 max-w-3xl pb-24">
        <Calendar workoutData={calendarWorkouts} splitColors={splitColors} />
        <WorkoutHeader split={currentWorkout.split} />
        <div className="mt-8 space-y-6">
          {currentWorkout.exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
        <div className="mt-12">
          <ProgressiveOverload exercises={currentWorkout.exercises} />
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
