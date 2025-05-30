import React from 'react'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
interface HeaderProps {
  date: Date
  setDate: (date: Date) => void
}
export const Header: React.FC<HeaderProps> = ({ date, setDate }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }
  const goToPreviousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }
  const goToNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
  }
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">Macros Tracker</h1>
      <div className="flex items-center space-x-1 bg-[#1E1E1E] rounded-lg p-1">
        <button
          onClick={goToPreviousDay}
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-md transition-colors">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span>{formatDate(date)}</span>
        </button>
        <button
          onClick={goToNextDay}
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
