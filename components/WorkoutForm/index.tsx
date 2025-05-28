import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Exercise {
  id: string
  name: string
  sets: {
    weight: number
    reps: number
  }[]
}

interface WorkoutFormProps {
  onSubmit: (workout: { date: string; exercises: Exercise[] }) => void
  onCancel: () => void
  initialData?: {
    date: string
    exercises: Exercise[]
  }
}

export function WorkoutForm({ onSubmit, onCancel, initialData }: WorkoutFormProps) {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises || [{ id: uuidv4(), name: '', sets: [{ weight: 0, reps: 0 }] }]
  )

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: uuidv4(), name: '', sets: [{ weight: 0, reps: 0 }] },
    ])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0 }] }
          : exercise
      )
    )
  }

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, index) => index !== setIndex),
            }
          : exercise
      )
    )
  }

  const updateExerciseName = (id: string, name: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, name } : exercise
      )
    )
  }

  const updateSet = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: number) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ date, exercises })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <div
            key={exercise.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                placeholder="Exercise name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                required
              />
              {exerciseIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeExercise(exercise.id)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-12">
                    Set {setIndex + 1}
                  </span>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) =>
                      updateSet(exercise.id, setIndex, 'weight', Number(e.target.value))
                    }
                    placeholder="Weight"
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                    required
                    min="0"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(exercise.id, setIndex, 'reps', Number(e.target.value))
                    }
                    placeholder="Reps"
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                    required
                    min="0"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">reps</span>
                  {setIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSet(exercise.id, setIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSet(exercise.id)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Add Set
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addExercise}
        className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Add Exercise
      </button>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Save Workout
        </button>
      </div>
    </form>
  )
} 