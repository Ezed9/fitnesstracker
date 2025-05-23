import AuthWrapper from '@/components/AuthWrapper'
import Layout from '@/components/layout/Layout'

export default function Workout() {
  const workouts = [
    { name: 'Push Day', exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'], lastDone: '2 days ago' },
    { name: 'Pull Day', exercises: ['Deadlifts', 'Pull-ups', 'Rows'], lastDone: '3 days ago' },
    { name: 'Leg Day', exercises: ['Squats', 'Lunges', 'Calf Raises'], lastDone: '4 days ago' },
  ]

  return (
    <AuthWrapper>
      <Layout title="Workout | FitTrack">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Workouts</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              New Workout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{workout.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Last done: {workout.lastDone}</p>
                <div className="space-y-2 mb-4">
                  {workout.exercises.map((exercise, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm">{exercise}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200">
                  Start Workout
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <h3 className="font-medium">Quick Workout</h3>
                <p className="text-sm text-gray-500">Start a custom workout</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
                <h3 className="font-medium">Continue Last</h3>
                <p className="text-sm text-gray-500">Repeat your last workout</p>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
