import { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import Layout from '@/components/layout/Layout'

export default function Settings() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'user@example.com',
    weight: 70,
    height: 175,
    notifications: true,
    darkMode: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save settings logic here
    alert('Settings saved successfully')
  }

  return (
    <AuthWrapper>
      <Layout title="Settings | FitTrack">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h2 className="text-lg font-medium mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Enable Notifications</label>
                        <p className="text-sm text-gray-500">Get notified about your fitness progress</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={formData.notifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dark Mode</label>
                        <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="darkMode"
                          checked={formData.darkMode}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </AuthWrapper>
  )
}
