import React from 'react'
import { ProfileCard } from './settings/ProfileCard'
import { MacroGoalsCard } from './settings/MacroGoalsCard'
import { WorkoutPreferencesCard } from './settings/WorkoutPreferencesCard'
import { WeightGoalCard } from './settings/WeightGoalCard'
import { DangerZoneCard } from './settings/DangerZoneCard'
import { MoonIcon } from 'lucide-react'
export function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
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
        <footer className="mt-10 text-center text-[#A1A1AA] text-sm py-4">
          <p>"Stay consistent and the results will come."</p>
        </footer>
      </div>
    </div>
  )
}
