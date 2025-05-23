import AuthWrapper from '@/components/AuthWrapper'
import Layout from '@/components/layout/Layout'

export default function MacroTracker() {
  return (
    <AuthWrapper>
      <Layout title="Macro Tracker | FitTrack">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Macro Tracker</h1>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Protein</h3>
                <p className="text-2xl font-bold">120g</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Carbs</h3>
                <p className="text-2xl font-bold">250g</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Fats</h3>
                <p className="text-2xl font-bold">60g</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>
              <div className="space-y-4">
                {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                  <div key={meal} className="border-b pb-2">
                    <h3 className="font-medium">{meal}</h3>
                    <p className="text-sm text-gray-500">Click to add food</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
