import React from 'react';

export const WorkoutPreview = () => {
  // Sample data - in a real app, this would come from props or a state management solution
  const workout = {
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: '60kg' },
      { name: 'Pull-ups', sets: 3, reps: '8-10', weight: 'Bodyweight' },
      { name: 'Shoulder Press', sets: 3, reps: '10-12', weight: '20kg' },
    ],
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{workout.name}</h3>
      <div className="space-y-3">
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium">{exercise.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {exercise.sets} sets × {exercise.reps}
              </p>
            </div>
            <span className="text-sm font-medium">{exercise.weight}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
          View Full Workout →
        </button>
      </div>
    </div>
  );
};
