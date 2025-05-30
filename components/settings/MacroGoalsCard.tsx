import React from 'react'
import { FlameIcon, BarChartIcon } from 'lucide-react'
export function MacroGoalsCard() {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Macro Goals</h2>
      <p className="text-[#A1A1AA] text-sm mb-6">
        Set your goals and crush them!
      </p>
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
              defaultValue="2400"
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
              defaultValue="180"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              defaultValue="240"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-1">
              Fats (g)
            </label>
            <input
              type="number"
              defaultValue="65"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
            />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <BarChartIcon size={18} className="text-[#60A5FA] mr-2" />
          <p className="text-xs text-[#A1A1AA]">
            Macro split: 30% protein, 40% carbs, 30% fats
          </p>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-[#4ADE80] text-white rounded-lg hover:bg-[#3AC070] transition-colors">
          Save Macro Goals
        </button>
      </div>
    </div>
  )
}
