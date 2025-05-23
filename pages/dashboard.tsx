import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthWrapper from '@/components/AuthWrapper'
import Layout from '@/components/layout/Layout'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <AuthWrapper>
      <Layout title="Dashboard | FitTrack">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Workouts This Week</h3>
              <p className="text-3xl font-bold mt-2">3</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Calories Burned</h3>
              <p className="text-3xl font-bold mt-2">1,250</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium">Current Streak</h3>
              <p className="text-3xl font-bold mt-2">5 days</p>
            </div>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
