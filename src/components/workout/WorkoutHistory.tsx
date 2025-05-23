import React from 'react';

interface WorkoutHistoryProps {
  limit?: number;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ limit = 3 }) => {
  // Sample data - in a real app, this would come from props or a state management solution
  const workouts = [
    { id: 1, name: 'Upper Body', date: '2023-05-20', duration: '45 min', exercises: 5 },
    { id: 2, name: 'Lower Body', date: '2023-05-18', duration: '50 min', exercises: 6 },
    { id: 3, name: 'Full Body', date: '2023-05-16', duration: '60 min', exercises: 8 },
    { id: 4, name: 'Cardio', date: '2023-05-14', duration: '30 min', exercises: 3 },
    { id: 5, name: 'Upper Body', date: '2023-05-13', duration: '45 min', exercises: 5 },
  ].slice(0, limit);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-3">
      {workouts.map((workout) => (
        <div key={workout.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <div>
            <h4 className="font-medium">{workout.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {workout.exercises} exercises • {workout.duration}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(workout.date)}
          </div>
        </div>
      ))}
      {limit < 5 && (
        <button className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium mt-2">
          View All Workouts
        </button>
      )}
    </div>
  );
};
