import React, { useState, useEffect } from 'react'
import { ScaleIcon, TrendingUpIcon, SaveIcon, CheckIcon } from 'lucide-react'
import { useSupabase } from '@/contexts/SupabaseContext'
import { saveWeightEntry, getWeightHistory } from '@/services/supabaseService'
import { toast } from 'react-hot-toast'

export function WeightGoalCard() {
  const supabase = useSupabase()
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [targetWeight, setTargetWeight] = useState<number>(0) // We might need a new table or column for this
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeightData = async () => {
      setLoading(true)
      const history = await getWeightHistory(supabase)
      if (history.length > 0) {
        // Assume the last entry is current weight
        const latest = history[history.length - 1]
        setCurrentWeight(latest.weight)
      }

      // TODO: We need to store target_weight somewhere. 
      // For now, we'll fetch it from user_data if we update getProfile, 
      // or just trust local state/mock for "target" if DB support is missing.
      // Based on schema, 'user_data' has 'target_weight'. 
      // We should probably add a service for 'getUserProfile' to get this.
      // For this step, I'll stick to updating the current weight entry.
      setLoading(false)
    }
    fetchWeightData()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    try {
      const date = new Date().toISOString().split('T')[0]
      const success = await saveWeightEntry(supabase, currentWeight, date)
      if (success) {
        toast.success('Weight updated!')
      } else {
        toast.error('Failed to update weight')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error saving weight')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Weight Goal</h2>
      <p className="text-[#A1A1AA] text-sm mb-6">
        Set realistic targets for sustainable progress
      </p>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#60A5FA]/20 flex items-center justify-center mr-3">
              <ScaleIcon size={18} className="text-[#60A5FA]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Current Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={currentWeight || ''}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
                <span className="bg-[#2A2A2A] border-y border-r border-[#3A3A3A] rounded-r-lg px-3 flex items-center text-[#A1A1AA]">
                  kg
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#4ADE80]/20 flex items-center justify-center mr-3">
              <TrendingUpIcon size={18} className="text-[#4ADE80]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Target Weight
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={targetWeight || ''}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
                <span className="bg-[#2A2A2A] border-y border-r border-[#3A3A3A] rounded-r-lg px-3 flex items-center text-[#A1A1AA]">
                  kg
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 w-full px-4 py-2 bg-[#60A5FA] text-white rounded-lg hover:bg-[#4A95EA] transition-colors flex justify-center items-center"
          >
            {saving ? 'Saving...' : 'Update Weight Log'}
          </button>
        </div>
      )}
    </div>
  )
}
