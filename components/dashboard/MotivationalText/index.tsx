import React from 'react'
import { TrendingUpIcon } from 'lucide-react'

interface MotivationalTextProps {
  percentage: number
  nutrient: string
}

export function MotivationalText({ percentage, nutrient }: MotivationalTextProps) {
  return (
    <div className="flex items-center mt-6 p-4 bg-gradient-to-r from-[#4ADE80]/10 to-transparent rounded-lg border border-[#4ADE80]/20 hover:border-[#4ADE80]/30 transition-colors duration-300">
      <div className="h-8 w-8 rounded-lg bg-[#4ADE80]/10 flex items-center justify-center mr-3">
        <TrendingUpIcon className="h-5 w-5 text-[#4ADE80]" />
      </div>
      <p className="text-sm">
        <span className="font-medium text-[#4ADE80]">Great progress!</span> You're{' '}
        {percentage}% to your {nutrient} goal!
      </p>
    </div>
  )
}
