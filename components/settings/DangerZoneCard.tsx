import React from 'react'
import { AlertTriangleIcon } from 'lucide-react'
export function DangerZoneCard() {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-red-900/30">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <AlertTriangleIcon size={18} className="text-red-500 mr-2" />
        Danger Zone
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-[#2A2A2A] rounded-lg">
          <h3 className="font-medium mb-2">Delete Account</h3>
          <p className="text-sm text-[#A1A1AA] mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
            Delete Account
          </button>
        </div>
        <div className="p-4 bg-[#2A2A2A] rounded-lg">
          <h3 className="font-medium mb-2">Export Your Data</h3>
          <p className="text-sm text-[#A1A1AA] mb-4">
            Download all your workout and nutrition data.
          </p>
          <button className="px-4 py-2 bg-transparent border border-[#3A3A3A] text-white rounded-lg hover:bg-[#3A3A3A] transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  )
}
