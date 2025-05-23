import React from 'react';

export const ProgressCharts = () => {
  // Sample data - in a real app, this would come from props or a state management solution
  const exercises = [
    { name: 'Bench Press', data: [60, 62.5, 65, 67.5, 70] },
    { name: 'Squat', data: [80, 82.5, 85, 87.5, 90] },
    { name: 'Deadlift', data: [100, 102.5, 105, 107.5, 110] },
  ];

  const maxValue = Math.max(...exercises.flatMap(ex => ex.data));
  const minValue = Math.min(...exercises.flatMap(ex => ex.data));
  const range = maxValue - minValue;

  // Simple bar chart component
  const BarChart = ({ data, color }: { data: number[]; color: string }) => {
    return (
      <div className="h-8 w-full flex items-end space-x-1">
        {data.map((value, index) => {
          const height = ((value - minValue) / range) * 100;
          return (
            <div
              key={index}
              className={`flex-1 ${color} rounded-t`}
              style={{
                height: `${Math.max(10, height)}%`,
                minHeight: '4px',
              }}
              title={`${value}kg`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <div key={exercise.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{exercise.name}</h4>
            <span className="text-sm text-gray-500">
              {exercise.data[exercise.data.length - 1]} kg
              <span className="text-green-500 ml-1">
                (+{exercise.data[exercise.data.length - 1] - exercise.data[0]} kg)
              </span>
            </span>
          </div>
          <BarChart 
            data={exercise.data} 
            color={
              exercise.name === 'Bench Press' ? 'bg-blue-500' :
              exercise.name === 'Squat' ? 'bg-green-500' : 'bg-yellow-500'
            } 
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>4w ago</span>
            <span>3w ago</span>
            <span>2w ago</span>
            <span>1w ago</span>
            <span>Now</span>
          </div>
        </div>
      ))}
    </div>
  );
};
