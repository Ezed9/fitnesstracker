import React, { useState, useEffect } from 'react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { WorkoutHeader } from '@/components/workout/WorkoutHeader'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { ProgressiveOverload } from '@/components/workout/ProgressiveOverload'
import { WorkoutHistory } from '@/components/workout/WorkoutHistory'
import { FloatingActionButton } from '@/components/workout/FloatingActionButton'
import Calendar from '@/components/Calendar/Calendar'
import { type Workout, type WorkoutExercise, splitColors } from '@/components/mockData'
import { useSupabase } from '@/contexts/SupabaseContext'
import { getWorkouts, Workout as ServiceWorkout } from '@/services/workoutService'

export default function Workout() {
  const supabase = useSupabase()
  const [workouts, setWorkouts] = useState<ServiceWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true)
      try {
        // Fetch last 3 months
        const fromDate = new Date()
        fromDate.setMonth(fromDate.getMonth() - 2)
        const toDate = new Date()
        toDate.setMonth(toDate.getMonth() + 1) // Just in case of future planning

        const data = await getWorkouts(supabase, fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0])
        setWorkouts(data)
      } catch (error) {
        console.error('Failed to fetch workouts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [supabase])

  // Find workout for today
  const todayStr = new Date().toISOString().split('T')[0]
  const todayWorkout = workouts.find(w => w.date === todayStr)

  // Map service workout to UI workout format if needed
  // UI expects 'split' which we might derive or default
  const formattedCurrentWorkout = todayWorkout ? {
    split: todayWorkout.name || 'Workout',
    exercises: todayWorkout.exercises.map(e => ({
      id: parseInt(e.id || '0') || Math.random(), // ID needs to be number for UI mock types, assuming
      name: e.name,
      sets: e.sets.map(s => ({
        reps: s.reps,
        weight: s.weight,
        completed: s.completed || false
      })),
      lastSession: { // Mocking last session for now as it requires complex query
        sets: 3,
        reps: 10,
        weight: 0
      },
      suggestion: { // Mocking suggestion
        type: 'weight' as const,
        value: 2.5,
        message: 'Progressive Overload'
      }
    }))
  } : null

  // Format workouts for Calendar
  const calendarWorkouts = workouts.map(w => ({
    date: w.date,
    splitType: w.name || 'Workout',
    exercises: w.exercises.map(e => ({
      name: e.name,
      sets: e.sets.map(s => ({ reps: s.reps, weight: s.weight })),
      progressiveOverload: false
    }))
  }))

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-6 max-w-3xl pb-24">
        <Calendar workoutData={calendarWorkouts as any} splitColors={splitColors} />

        {formattedCurrentWorkout ? (
          <>
            <WorkoutHeader split={formattedCurrentWorkout.split} />
            <div className="mt-8 space-y-6">
              {formattedCurrentWorkout.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise as any} />
              ))}
            </div>
            <div className="mt-12">
              <ProgressiveOverload exercises={formattedCurrentWorkout.exercises as any} />
            </div>
          </>
        ) : (
          <div className="mt-8 text-center py-12 bg-[#1E1E1E] rounded-xl">
            <h3 className="text-xl font-semibold mb-2">No Workout Today</h3>
            <p className="text-gray-400">Tap + to log a workout</p>
          </div>
        )}

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
