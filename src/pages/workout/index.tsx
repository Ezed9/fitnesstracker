import { Layout } from '@/components/shared/Layout';
import { WorkoutHistory } from '@/components/workout/WorkoutHistory';
import { TodaysWorkout } from '@/components/workout/TodaysWorkout';
import { ProgressCharts } from '@/components/workout/ProgressCharts';

export default function WorkoutPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Workout Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Workout */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Today's Workout</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  + Add Exercise
                </button>
              </div>
              <TodaysWorkout />
            </section>
            
            {/* Progress Charts */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Exercise Progress</h2>
              <ProgressCharts />
            </section>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Workout History */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
              <WorkoutHistory limit={5} />
            </section>
            
            {/* Quick Stats */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Workouts This Week</p>
                  <p className="text-2xl font-bold">3/5</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Workout</p>
                  <p className="text-lg font-medium">2 days ago</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
