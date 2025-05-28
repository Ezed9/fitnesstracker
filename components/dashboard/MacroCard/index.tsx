import React, { useState, ReactNode } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface Food {
  name: string
  amount: number
  unit: string
}

interface MacroCardProps {
  title: string
  current: number
  target: number
  unit: string
  icon: ReactNode
  color: string
  foods: Food[]
}

export function MacroCard({
  title,
  current,
  target,
  unit,
  icon,
  color,
  foods,
}: MacroCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const percentage = Math.min(100, Math.round((current / target) * 100))
  
  return (
    <div
      className={`group bg-[#1E1E1E] hover:bg-[#242424] transition-all duration-300 rounded-xl shadow-lg relative overflow-hidden
        ${isExpanded ? 'col-span-full' : ''}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-5"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-white via-white/5 to-transparent"></div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="mr-2 text-[#A1A1AA] group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-[#A1A1AA]">
              {current}/{target} {unit}
            </span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4 text-[#A1A1AA]" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-[#A1A1AA]" />
            )}
          </div>
        </div>
        <div className="h-2.5 w-full bg-[#333333] rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
            style={{
              width: `${percentage}%`,
            }}
          ></div>
        </div>
        <div className="mt-2 text-right">
          <span className="text-xs text-[#A1A1AA]">{percentage}%</span>
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[#333333] mt-2">
          <h4 className="text-sm font-medium text-[#A1A1AA] mt-4 mb-3">
            Food Sources
          </h4>
          <div className="space-y-3">
            {foods.map((food, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 hover:bg-[#252525] rounded transition-colors"
              >
                <span className="text-sm">{food.name}</span>
                <span className="text-sm text-[#A1A1AA]">
                  {food.amount} {food.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
