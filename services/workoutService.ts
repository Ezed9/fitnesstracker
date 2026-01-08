import { SupabaseClient } from '@supabase/supabase-js';

export interface ExerciseSet {
    id?: string;
    exercise_id?: string;
    weight: number;
    reps: number;
    completed?: boolean; // Note: Schema doesn't have 'completed', might need to add or assume true for saved history
}

export interface Exercise {
    id?: string;
    workout_id?: string;
    name: string;
    sets: ExerciseSet[];
}

export interface Workout {
    id?: string;
    user_id?: string;
    date: string;
    name?: string; // Schema doesn't have name/split, maybe add? Or assume it's implicitly defined by exercises.
    exercises: Exercise[];
}

// NOTE: The schema for 'workouts' table only has: id, user_id, date, created_at, updated_at.
// It does NOT have a name or split type. 
// For now, we will infer the "Split" from the exercises or just not show it, 
// OR we should update the schema to include a name/split column if the UI requires it (which it does, e.g. "Leg Day").
// The mock data had 'split': 'Leg Day'. 
// I will check if I should update schema. The user said "database got deleted i need to do it again", but later "make everything functional". 
// The UI expects a split name. I'll stick to the current schema for now 
// and maybe store the "name" as a note or just formatted date, 
// OR I will auto-add a column if I can.
// Actually, looking at the UI `WorkoutHeader split={currentWorkout.split}`, it definitely needs it.
// I'll add a modification to the schema to add `name` to workouts table.

export const getWorkouts = async (supabase: SupabaseClient, fromDate: string, toDate: string): Promise<Workout[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('workouts')
        .select(`
      id,
      date,
      name,
      created_at,
      exercises (
        id,
        name,
        exercise_sets (
          id,
          weight,
          reps
        )
      )
    `)
        .eq('user_id', session.user.id)
        .gte('date', fromDate)
        .lte('date', toDate)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }

    // Transform to match UI interfaces if necessary
    return data.map((w: any) => ({
        id: w.id,
        user_id: session.user.id,
        date: w.date,
        name: w.name,
        exercises: w.exercises.map((e: any) => ({
            id: e.id,
            name: e.name,
            sets: e.exercise_sets.map((s: any) => ({
                id: s.id,
                weight: s.weight,
                reps: s.reps,
                completed: true // Assumed true for history
            }))
        }))
    }));
};

export const saveWorkout = async (supabase: SupabaseClient, workout: Workout, workoutName?: string): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    // 1. Create Workout
    const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
            user_id: session.user.id,
            date: workout.date,
            name: workoutName || 'Workout' // Default if not provided
        })
        .select()
        .single();

    if (workoutError || !workoutData) {
        console.error('Error saving workout:', workoutError);
        return null;
    }

    const workoutId = workoutData.id;

    // 2. Create Exercises
    for (const exercise of workout.exercises) {
        const { data: exerciseData, error: exerciseError } = await supabase
            .from('exercises')
            .insert({
                workout_id: workoutId,
                name: exercise.name
            })
            .select()
            .single();

        if (exerciseError || !exerciseData) {
            console.error(`Error saving exercise ${exercise.name}:`, exerciseError);
            continue;
        }

        const exerciseId = exerciseData.id;

        // 3. Create Sets
        const sets = exercise.sets.map(s => ({
            exercise_id: exerciseId,
            weight: s.weight,
            reps: s.reps
        }));

        const { error: setsError } = await supabase
            .from('exercise_sets')
            .insert(sets);

        if (setsError) {
            console.error(`Error saving sets for ${exercise.name}:`, setsError);
        }
    }

    return workoutId;
};
