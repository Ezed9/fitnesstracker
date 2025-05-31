import React, { useEffect, useState } from 'react'
import { UserIcon, EditIcon, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
export function ProfileCard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user data from Supabase
  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        
        // Get the user session
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('User not found')
        }
        
        setUser(user)
        
        // Set the full name from user metadata
        if (user.user_metadata?.full_name) {
          setFullName(user.user_metadata.full_name)
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error.message)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [supabase])

  // Handle updating the user profile
  const handleUpdateProfile = async () => {
    try {
      setUpdating(true)
      setError('')
      setSuccess('')
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      
      if (error) throw error
      
      setSuccess('Profile updated successfully!')
      
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      setUser(updatedUser)
    } catch (error: any) {
      console.error('Error updating profile:', error.message)
      setError(error.message || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#60A5FA]" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <UserIcon size={40} className="text-[#A1A1AA]" />
              {user && user.email && (
                <span className="sr-only">{user.email.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button 
              className="absolute bottom-0 right-0 bg-[#60A5FA] p-1.5 rounded-full"
              aria-label="Change profile picture"
            >
              <EditIcon size={16} />
            </button>
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            {error && (
              <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}
            
            <div>
              <label htmlFor="fullName" className="block text-sm text-[#A1A1AA] mb-1">Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-[#A1A1AA] mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 opacity-70 cursor-not-allowed"
              />
            </div>
            
            <button 
              onClick={handleUpdateProfile}
              disabled={updating || !fullName.trim()}
              className="mt-4 px-4 py-2 bg-[#60A5FA] text-white rounded-lg hover:bg-[#4A95EA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : 'Save Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
