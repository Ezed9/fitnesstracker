import React from 'react'
import { ActivityIcon } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">FitTrack</span>
        </div>
        <nav className="ml-auto">
          <ul className="flex gap-6">
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Login
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
