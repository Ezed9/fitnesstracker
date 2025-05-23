import React from 'react'
import {
  ActivityIcon,
  BarChart2Icon,
  ClipboardListIcon,
  LineChartIcon,
} from 'lucide-react'
export const FeatureSection = () => {
  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Track Your Fitness Journey
        </h1>
        <p className="text-lg text-gray-600">
          Join thousands of users who are transforming their lives with our
          comprehensive fitness tracking platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<BarChart2Icon className="h-8 w-8 text-blue-600" />}
          title="Macros Tracking"
          description="Monitor your calorie intake and macronutrient balance to optimize your diet."
        />
        <FeatureCard
          icon={<ActivityIcon className="h-8 w-8 text-blue-600" />}
          title="Workout Plans"
          description="Access customizable workout plans designed by fitness professionals."
        />
        <FeatureCard
          icon={<ClipboardListIcon className="h-8 w-8 text-blue-600" />}
          title="Diet Plans"
          description="Get personalized meal plans based on your fitness goals and preferences."
        />
        <FeatureCard
          icon={<LineChartIcon className="h-8 w-8 text-blue-600" />}
          title="Progress Tracking"
          description="Visualize your progress with detailed charts and performance metrics."
        />
      </div>
      <div className="mt-8 flex justify-center">
        <div className="bg-blue-100 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-blue-200 rounded-full p-2">
            <ActivityIcon className="h-6 w-6 text-blue-700" />
          </div>
          <p className="text-blue-800 font-medium">
            Over 10,000+ users are already achieving their fitness goals!
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export { FeatureCard }
