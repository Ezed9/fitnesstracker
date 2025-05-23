import React, { useState } from 'react';

export const TodaysWorkout = () => {
  // Sample data - in a real app, this would come from props or a state management solution
  const [exercises, setExercises] = useState([
    { 
      id: 1, 
      name: 'Bench Press', 
      sets: [
        { id: 1, weight: 60, reps: 10, completed: false },
        { id: 2, weight: 62.5, reps: 8, completed: false },
        { id: 3, weight: 65, reps: 6, completed: false },
      ]
    },
    { 
      id: 2, 
      name: 'Pull-ups', 
      sets: [
        { id: 1, weight: 0, reps: 8, completed: false },
        { id: 2, weight: 0, reps: 8, completed: false },
        { id: 3, weight: 0, reps: 'AMRAP', completed: false },
      ]
    },
    { 
      id: 3, 
      name: 'Shoulder Press', 
      sets: [
        { id: 1, weight: 20, reps: 10, completed: false },
        { id: 2, weight: 22.5, reps: 8, completed: false },
        { id: 3, weight: 25, reps: 6, completed: false },
      ]
    },
  ]);

  const toggleSetComplete = (exerciseId: number, setId: number) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => 
            set.id === setId 
              ? { ...set, completed: !set.completed } 
              : set
          )
        };
      }
      return exercise;
    }));
  };

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{exercise.name}</h3>
            <div className="flex space-x-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {exercise.sets.length} sets
              </span>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {exercise.sets[0].weight > 0 ? `${exercise.sets[0].weight}kg` : 'Bodyweight'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {exercise.sets.map((set) => (
              <button
                key={set.id}
                onClick={() => toggleSetComplete(exercise.id, set.id)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  set.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">
                  {set.weight > 0 ? `${set.weight}kg` : 'BW'}
                </div>
                <div className="text-sm opacity-75">
                  {set.reps} {typeof set.reps === 'number' ? 'reps' : ''}
                </div>
                {set.completed && (
                  <div className="mt-1">
                    <svg className="w-4 h-4 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="pt-2">
        <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
          Complete Workout
        </button>
      </div>
    </div>
  );
};
