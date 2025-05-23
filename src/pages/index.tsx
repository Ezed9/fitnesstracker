import { Layout } from '@/components/shared/Layout';
import { MacrosSummary } from '@/components/macros/MacrosSummary';
import { WorkoutPreview } from '@/components/workout/WorkoutPreview';
import { WeightTracker } from '@/components/dashboard/WeightTracker';

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Today's Macros Summary */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Macros</h2>
          <MacrosSummary />
        </section>

        {/* Today's Workout Preview */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
          <WorkoutPreview />
        </section>

        {/* Weight Tracking */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
          <WeightTracker />
        </section>

        {/* Quick Actions */}
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Add Meal
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            Log Workout
          </button>
        </div>
      </div>
    </Layout>
  );
}
