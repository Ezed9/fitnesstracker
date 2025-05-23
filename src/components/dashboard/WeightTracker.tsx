import React from 'react';

export const WeightTracker = () => {
  // Sample data - in a real app, this would come from props or a state management solution
  const weightData = [
    { date: '2023-04-15', weight: 78.5 },
    { date: '2023-04-22', weight: 78.0 },
    { date: '2023-04-29', weight: 77.5 },
    { date: '2023-05-06', weight: 77.0 },
    { date: '2023-05-13', weight: 76.5 },
    { date: '2023-05-20', weight: 76.0 },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const minWeight = Math.min(...weightData.map(d => d.weight));
  const maxWeight = Math.max(...weightData.map(d => d.weight));
  const weightRange = maxWeight - minWeight || 10; // Avoid division by zero

  const startWeight = weightData[0]?.weight || 0;
  const currentWeight = weightData[weightData.length - 1]?.weight || 0;
  const weightDifference = currentWeight - startWeight;
  const weightDifferencePercentage = ((weightDifference / startWeight) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">Current Weight</p>
          <p className="text-2xl font-bold">{currentWeight} kg</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Change</p>
          <p className={`text-lg font-medium ${weightDifference < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {weightDifference >= 0 ? '+' : ''}{weightDifference.toFixed(1)} kg 
            ({weightDifference >= 0 ? '+' : ''}{weightDifferencePercentage}%)
          </p>
        </div>
      </div>

      <div className="h-40 relative">
        <div className="absolute inset-0 flex items-end">
          <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>
        </div>
        
        <div className="relative h-full flex items-end">
          {weightData.map((entry, index) => {
            const height = ((entry.weight - minWeight) / weightRange) * 100;
            const isFirst = index === 0;
            const isLast = index === weightData.length - 1;
            
            return (
              <div 
                key={entry.date}
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className={`w-1 rounded-t-full ${
                    isLast ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ height: `${Math.max(10, height)}%` }}
                ></div>
                <div className="mt-1 text-xs text-gray-500">
                  {formatDate(entry.date)}
                </div>
                {(isFirst || isLast) && (
                  <div className="text-xs font-medium mt-1">
                    {entry.weight}kg
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Start: {startWeight} kg</span>
        <span className="text-gray-500">Goal: 75 kg</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{
            width: `${Math.min(100, ((startWeight - currentWeight) / (startWeight - 75)) * 100)}%`
          }}
        ></div>
      </div>
    </div>
  );
};
