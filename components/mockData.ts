// Types for our workout data
export interface WorkoutExercise {
  name: string
  sets: {
    reps: number
    weight: number
  }[]
  progressiveOverload?: boolean
}

export interface Workout {
  date: string // ISO format YYYY-MM-DD
  splitType: string
  exercises: WorkoutExercise[]
}

export interface SplitColors {
  [key: string]: string
}

// Default split colors
export const splitColors: SplitColors = {
  Push: '#60A5FA', // Blue
  Pull: '#4ADE80', // Green
  Legs: '#FACC15', // Yellow
  Upper: '#F472B6', // Pink
  Lower: '#A78BFA', // Purple
  Core: '#FB923C', // Orange
  Rest: '#71717A', // Gray
  Cardio: '#2DD4BF', // Teal
}

// Sample workout data for the current month
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

export const workoutData: Workout[] = [
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-03`,
    splitType: 'Push',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 175 },
        ],
        progressiveOverload: true,
      },
      {
        name: 'Overhead Press',
        sets: [
          { reps: 10, weight: 85 },
          { reps: 8, weight: 95 },
          { reps: 6, weight: 105 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`,
    splitType: 'Pull',
    exercises: [
      {
        name: 'Deadlift',
        sets: [
          { reps: 8, weight: 225 },
          { reps: 6, weight: 245 },
          { reps: 4, weight: 265 },
        ],
      },
      {
        name: 'Barbell Row',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 10, weight: 135 },
          { reps: 10, weight: 135 },
        ],
        progressiveOverload: true,
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-07`,
    splitType: 'Legs',
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 10, weight: 185 },
          { reps: 8, weight: 205 },
          { reps: 6, weight: 225 },
        ],
      },
      {
        name: 'Leg Press',
        sets: [
          { reps: 12, weight: 270 },
          { reps: 10, weight: 360 },
          { reps: 8, weight: 410 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10`,
    splitType: 'Push',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 185 },
        ],
        progressiveOverload: true,
      },
      {
        name: 'Incline Dumbbell Press',
        sets: [
          { reps: 10, weight: 50 },
          { reps: 10, weight: 55 },
          { reps: 8, weight: 60 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12`,
    splitType: 'Pull',
    exercises: [
      {
        name: 'Pull-ups',
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
        ],
      },
      {
        name: 'Barbell Row',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 10, weight: 145 },
          { reps: 8, weight: 155 },
        ],
        progressiveOverload: true,
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-14`,
    splitType: 'Legs',
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 10, weight: 185 },
          { reps: 8, weight: 205 },
          { reps: 6, weight: 235 },
        ],
        progressiveOverload: true,
      },
      {
        name: 'Romanian Deadlift',
        sets: [
          { reps: 10, weight: 185 },
          { reps: 10, weight: 185 },
          { reps: 10, weight: 185 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-17`,
    splitType: 'Upper',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 175 },
        ],
      },
      {
        name: 'Barbell Row',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 10, weight: 145 },
          { reps: 8, weight: 155 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19`,
    splitType: 'Lower',
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 10, weight: 185 },
          { reps: 8, weight: 205 },
          { reps: 6, weight: 225 },
        ],
      },
      {
        name: 'Leg Press',
        sets: [
          { reps: 12, weight: 270 },
          { reps: 10, weight: 360 },
          { reps: 8, weight: 410 },
        ],
        progressiveOverload: true,
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-21`,
    splitType: 'Core',
    exercises: [
      {
        name: 'Crunches',
        sets: [
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 },
        ],
      },
      {
        name: 'Plank',
        sets: [
          { reps: 1, weight: 0 }, // Representing time in seconds as reps
          { reps: 1, weight: 0 },
          { reps: 1, weight: 0 },
        ],
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-24`,
    splitType: 'Push',
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 185 },
        ],
      },
      {
        name: 'Shoulder Press',
        sets: [
          { reps: 10, weight: 85 },
          { reps: 8, weight: 95 },
          { reps: 6, weight: 105 },
        ],
        progressiveOverload: true,
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-26`,
    splitType: 'Pull',
    exercises: [
      {
        name: 'Deadlift',
        sets: [
          { reps: 8, weight: 225 },
          { reps: 6, weight: 245 },
          { reps: 4, weight: 275 },
        ],
        progressiveOverload: true,
      },
      {
        name: 'Pull-ups',
        sets: [
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
        ],
        progressiveOverload: true,
      },
    ],
  },
  {
    date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-28`,
    splitType: 'Legs',
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 10, weight: 185 },
          { reps: 8, weight: 205 },
          { reps: 6, weight: 225 },
        ],
      },
      {
        name: 'Lunges',
        sets: [
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
          { reps: 10, weight: 40 },
        ],
      },
    ],
  },
]
