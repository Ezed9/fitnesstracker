import React from 'react'
import AuthWrapper from '@/components/AuthWrapper/index'
// Layout is already provided in _app.tsx
import { ProfileCard } from '@/components/settings/ProfileCard'
import { MacroGoalsCard } from '@/components/settings/MacroGoalsCard'
import { WorkoutPreferencesCard } from '@/components/settings/WorkoutPreferencesCard'
import { WeightGoalCard } from '@/components/settings/WeightGoalCard'
import { DangerZoneCard } from '@/components/settings/DangerZoneCard'
import { MoonIcon } from 'lucide-react'

export default function Settings() {
  return (
    <AuthWrapper>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Settings</h1>
              <button className="p-2 rounded-full bg-[#1E1E1E] hover:bg-[#2A2A2A] transition-colors">
                <MoonIcon size={20} />
              </button>
            </div>
            <p className="text-[#A1A1AA] text-sm">
              Customize your fitness journey
            </p>
          </header>
          <div className="space-y-6">
            <ProfileCard />
            <MacroGoalsCard />
            <WorkoutPreferencesCard />
            <WeightGoalCard />
            <DangerZoneCard />
          </div>
          {/* Motivational quote moved to global footer */}
          <div className="mt-10"></div>
        </div>
    </AuthWrapper>
  )
}
