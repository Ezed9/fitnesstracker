import React from 'react'
import { ScaleIcon, TrendingUpIcon } from 'lucide-react'
export function WeightGoalCard() {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Weight Goal</h2>
      <p className="text-[#A1A1AA] text-sm mb-6">
        Set realistic targets for sustainable progress
      </p>
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
                defaultValue="75"
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
                defaultValue="70"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
              />
              <span className="bg-[#2A2A2A] border-y border-r border-[#3A3A3A] rounded-r-lg px-3 flex items-center text-[#A1A1AA]">
                kg
              </span>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <div className="w-full bg-[#2A2A2A] rounded-full h-1.5">
            <div
              className="bg-[#4ADE80] h-1.5 rounded-full"
              style={{
                width: '60%',
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-[#A1A1AA]">
            <span>Current</span>
            <span>5kg to go</span>
          </div>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-[#60A5FA] text-white rounded-lg hover:bg-[#4A95EA] transition-colors">
          Update Weight Goal
        </button>
      </div>
    </div>
  )
}
