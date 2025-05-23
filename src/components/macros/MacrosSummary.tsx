import React from 'react';

interface MacrosSummaryProps {
  detailed?: boolean;
}

export const MacrosSummary: React.FC<MacrosSummaryProps> = ({ detailed = false }) => {
  // Sample data - in a real app, this would come from props or a state management solution
  const macros = {
    protein: { current: 120, target: 150, unit: 'g' },
    carbs: { current: 200, target: 250, unit: 'g' },
    fats: { current: 45, target: 65, unit: 'g' },
    calories: { current: 1850, target: 2200, unit: 'kcal' },
  };

  const getPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-4">
      {Object.entries(macros).map(([key, value]) => {
        const percentage = getPercentage(value.current, value.target);
        const colors = {
          protein: 'bg-blue-500',
          carbs: 'bg-green-500',
          fats: 'bg-yellow-500',
          calories: 'bg-red-500',
        };

        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium capitalize">{key}</span>
              <span>
                {value.current} / {value.target} {value.unit}
              </span>
            </div>
            <ProgressBar 
              percentage={percentage} 
              color={colors[key as keyof typeof colors] || 'bg-gray-500'} 
            />
            {detailed && (
              <div className="text-xs text-gray-500 text-right">
                {percentage}% of daily goal
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
