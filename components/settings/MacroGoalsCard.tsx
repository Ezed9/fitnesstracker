import React, { useState, useEffect } from 'react'
import { FlameIcon, BarChartIcon, SaveIcon, CheckIcon } from 'lucide-react'
import { getUserMacroGoals, saveUserMacroGoals, MacroGoals } from '@/services/supabaseService'
export function MacroGoalsCard() {
  const [macroGoals, setMacroGoals] = useState<MacroGoals>({
    calories: 2400,
    protein: 180,
    carbs: 240,
    fats: 65
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Fetch user's macro goals from Supabase
    const fetchMacroGoals = async () => {
      setLoading(true)
      const goals = await getUserMacroGoals()
      if (goals) {
        setMacroGoals(goals)
      }
      setLoading(false)
    }

    fetchMacroGoals()
  }, [])

  const handleInputChange = (field: keyof MacroGoals, value: string) => {
    setMacroGoals(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    
    const success = await saveUserMacroGoals(macroGoals)
    
    setSaving(false)
    if (success) {
      setSaveSuccess(true)
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  // Calculate macro split percentages
  const totalCaloriesFromMacros = 
    (macroGoals.protein * 4) + 
    (macroGoals.carbs * 4) + 
    (macroGoals.fats * 9)
  
  const proteinPercentage = Math.round((macroGoals.protein * 4 / totalCaloriesFromMacros) * 100) || 0
  const carbsPercentage = Math.round((macroGoals.carbs * 4 / totalCaloriesFromMacros) * 100) || 0
  const fatsPercentage = Math.round((macroGoals.fats * 9 / totalCaloriesFromMacros) * 100) || 0

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Macro Goals</h2>
      <p className="text-[#A1A1AA] text-sm mb-6">
        Set your goals and crush them!
      </p>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center mr-3">
              <FlameIcon size={18} className="text-[#FF6B6B]" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Daily Calories
              </label>
              <input
                type="number"
                value={macroGoals.calories}
                onChange={(e) => handleInputChange('calories', e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={macroGoals.protein}
                onChange={(e) => handleInputChange('protein', e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={macroGoals.carbs}
                onChange={(e) => handleInputChange('carbs', e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                value={macroGoals.fats}
                onChange={(e) => handleInputChange('fats', e.target.value)}
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <BarChartIcon size={18} className="text-[#60A5FA] mr-2" />
            <p className="text-xs text-[#A1A1AA]">
              Macro split: {proteinPercentage}% protein, {carbsPercentage}% carbs, {fatsPercentage}% fats
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`mt-4 w-full px-4 py-2 ${saveSuccess ? 'bg-[#3AC070]' : 'bg-[#4ADE80]'} text-white rounded-lg hover:bg-[#3AC070] transition-colors flex items-center justify-center`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : saveSuccess ? (
              <>
                <CheckIcon size={18} className="mr-2" />
                Saved!
              </>
            ) : (
              <>
                <SaveIcon size={18} className="mr-2" />
                Save Macro Goals
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
