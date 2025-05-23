import { Layout } from '@/components/shared/Layout';
import { MacrosSummary } from '@/components/macros/MacrosSummary';
import { MacrosCalendar } from '@/components/macros/MacrosCalendar';

export default function MacrosPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Macro Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Macros</h2>
              <MacrosSummary detailed />
            </section>
            
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Macro Goals</h2>
              <div className="space-y-4">
                {/* Macro goals form will go here */}
                <p>Set your daily macro goals</p>
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-1">
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Macro History</h2>
              <MacrosCalendar />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
