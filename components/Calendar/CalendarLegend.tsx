import React from 'react'
import { SplitColors } from '@/components/mockData'

interface CalendarLegendProps {
  splitColors: SplitColors
}

const CalendarLegend: React.FC<CalendarLegendProps> = ({ splitColors }) => {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      <h3 className="text-sm font-medium mb-2">Workout Types</h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(splitColors).map(([splitType, color]) => (
          <div key={splitType} className="flex items-center">
            <div
              className="h-3 w-3 rounded-full mr-1"
              style={{
                backgroundColor: color as string,
              }}
            ></div>
            <span className="text-xs text-gray-300">{splitType}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarLegend
