import React from 'react'
import { UserIcon, EditIcon } from 'lucide-react'
export function ProfileCard() {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <UserIcon size={40} className="text-[#A1A1AA]" />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#60A5FA] p-1.5 rounded-full">
            <EditIcon size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-1">Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-1">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              readOnly
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-2 opacity-70 cursor-not-allowed"
            />
          </div>
          <button className="mt-4 px-4 py-2 bg-[#60A5FA] text-white rounded-lg hover:bg-[#4A95EA] transition-colors">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}
