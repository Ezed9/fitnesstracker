import React from 'react'
import { PlusCircle } from 'lucide-react'
export const FloatingActionButton: React.FC = () => {
  return (
    <button className="fixed bottom-6 right-6 bg-[#4ADE80] hover:bg-green-500 text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center">
      <PlusCircle className="w-6 h-6" />
    </button>
  )
}
