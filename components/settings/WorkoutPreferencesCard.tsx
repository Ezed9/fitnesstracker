import React from 'react'
import { DumbbellIcon, ArrowUpIcon } from 'lucide-react'
export function WorkoutPreferencesCard() {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Workout Preferences</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-[#A1A1AA] mb-2">
            Workout Split
          </label>
          <select className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] appearance-none">
            <option>Push/Pull/Legs</option>
            <option>Upper/Lower</option>
            <option>Full Body</option>
            <option>Body Part Split</option>
            <option>Custom</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DumbbellIcon size={18} className="mr-2 text-[#A1A1AA]" />
            <span>Units</span>
          </div>
          <div className="flex items-center bg-[#2A2A2A] rounded-lg">
            <button className="px-4 py-1.5 rounded-l-lg bg-[#60A5FA] text-white">
              kg
            </button>
            <button className="px-4 py-1.5 rounded-r-lg hover:bg-[#2F2F2F] transition-colors">
              lb
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ArrowUpIcon size={18} className="mr-2 text-[#A1A1AA]" />
            <div>
              <span>Track Progressive Overload</span>
              <p className="text-xs text-[#A1A1AA]">
                Track your strength progress over time
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ADE80]"></div>
          </label>
        </div>
        <div className="mt-4">
          <button className="w-full px-4 py-2 border border-[#3A3A3A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
