import React from 'react';

export const MacrosCalendar = () => {
  // This is a simplified version. In a real app, you'd use a library like react-calendar
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInMonth = 31; // This would be dynamic in a real app
  const startingDay = 3; // 0 = Sunday, 1 = Monday, etc.

  // Generate days array with empty strings for days before the 1st
  const days = [
    ...Array(startingDay).fill(''),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  // In a real app, you'd have actual data for each day
  const getDayColor = (day: number | string) => {
    if (typeof day !== 'number') return '';
    
    // This is just sample logic - in a real app, you'd check actual macro data
    if (day % 7 === 0) return 'bg-red-100 text-red-800';
    if (day % 5 === 0) return 'bg-green-100 text-green-800';
    if (day % 3 === 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {weekdays.map((day) => (
          <div key={day} className="text-gray-500 p-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${
              day ? getDayColor(day) : 'opacity-0'
            }`}
          >
            {day || ''}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-100"></span>
          <span>On Track</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-100"></span>
          <span>Close to Limit</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-100"></span>
          <span>Over Limit</span>
        </div>
      </div>
    </div>
  );
};
