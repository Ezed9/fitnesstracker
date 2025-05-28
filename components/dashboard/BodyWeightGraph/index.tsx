import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface WeightData {
  date: string
  weight: number
}

interface BodyWeightGraphProps {
  data: WeightData[]
}

export function BodyWeightGraph({ data }: BodyWeightGraphProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            bottom: 5,
            left: 0,
          }}
        >
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={{
              fill: '#4ADE80',
              strokeWidth: 2,
            }}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#A1A1AA"
            tick={{
              fill: '#A1A1AA',
            }}
          />
          <YAxis
            stroke="#A1A1AA"
            tick={{
              fill: '#A1A1AA',
            }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E1E1E',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            labelFormatter={formatDate}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
