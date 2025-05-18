import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/utils/supabase'

interface TestResult {
  status: 'success' | 'error'
  message: string
  data?: any
  error?: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: { [key: string]: TestResult } = {}

  // Test 1: Database Connection
  try {
    const { data, error } = await supabase.from('workouts').select('count')
    results.connection = {
      status: error ? 'error' : 'success',
      message: error ? 'Database connection failed' : 'Database connection successful',
      error
    }
  } catch (error) {
    results.connection = {
      status: 'error',
      message: 'Database connection test failed',
      error
    }
  }

  // Test 2: Authentication
  try {
    // First, try to sign in with the real user account
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'nishitbaishya9@gmail.com',
      password: 'test1234'
    })

    if (signInError) {
      console.error('Sign in error:', signInError)
      results.auth = {
        status: 'error',
        message: 'Authentication failed with provided credentials',
        error: signInError
      }
    } else {
      results.auth = {
        status: 'success',
        message: 'Authentication successful with provided credentials',
        data: signInData
      }

      // Use the authenticated user for CRUD tests
      const testUser = signInData.user.id

      // Test 3: CRUD Operations
      try {
        // Test User Data Creation/Update
        const { data: existingUserData, error: fetchError } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', testUser)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw fetchError
        }

        let userData
        if (!existingUserData) {
          // Create new user data if it doesn't exist
          const { data: newUserData, error: userDataError } = await supabase
            .from('user_data')
            .insert([
              {
                user_id: testUser,
                display_name: 'Nishit Baishya',
                age: 25,
                gender: 'male',
                height: 175.5,
                target_weight: 70.0,
                activity_level: 'moderately_active',
                fitness_goal: 'maintenance',
                daily_calorie_target: 2500,
                daily_protein_target: 150,
                daily_carbs_target: 300,
                daily_fat_target: 80
              }
            ])
            .select()

          if (userDataError) throw userDataError
          userData = newUserData[0]
        } else {
          userData = existingUserData
        }

        // Test Workout Creation
        const { data: workout, error: workoutError } = await supabase
          .from('workouts')
          .insert([
            {
              user_id: testUser,
              date: new Date().toISOString().split('T')[0]
            }
          ])
          .select()

        if (workoutError) throw workoutError

        // Test Exercise Creation
        const { data: exercise, error: exerciseError } = await supabase
          .from('exercises')
          .insert([
            {
              workout_id: workout[0].id,
              name: 'Test Exercise'
            }
          ])
          .select()

        if (exerciseError) throw exerciseError

        // Test Exercise Set Creation
        const { data: set, error: setError } = await supabase
          .from('exercise_sets')
          .insert([
            {
              exercise_id: exercise[0].id,
              weight: 50,
              reps: 10
            }
          ])
          .select()

        if (setError) throw setError

        // Test Meal Creation
        const { data: meal, error: mealError } = await supabase
          .from('meals')
          .insert([
            {
              user_id: testUser,
              name: 'Test Meal',
              calories: 500,
              protein: 30,
              carbs: 50,
              fat: 20,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toTimeString().split(' ')[0]
            }
          ])
          .select()

        if (mealError) throw mealError

        // Test Weight Entry Creation
        const { data: weight, error: weightError } = await supabase
          .from('weight_entries')
          .insert([
            {
              user_id: testUser,
              weight: 70.5,
              date: new Date().toISOString().split('T')[0]
            }
          ])
          .select()

        if (weightError) throw weightError

        results.crud = {
          status: 'success',
          message: 'CRUD operations successful',
          data: {
            userData,
            workout: workout[0],
            exercise: exercise[0],
            set: set[0],
            meal: meal[0],
            weight: weight[0]
          }
        }

        // Clean up test data except user_data
        await supabase.from('exercise_sets').delete().eq('exercise_id', exercise[0].id)
        await supabase.from('exercises').delete().eq('workout_id', workout[0].id)
        await supabase.from('workouts').delete().eq('id', workout[0].id)
        await supabase.from('meals').delete().eq('id', meal[0].id)
        await supabase.from('weight_entries').delete().eq('id', weight[0].id)

      } catch (error) {
        console.error('CRUD error:', error)
        results.crud = {
          status: 'error',
          message: 'CRUD operations failed',
          error
        }
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    results.auth = {
      status: 'error',
      message: 'Authentication test failed',
      error
    }
  }

  const allTestsPassed = Object.values(results).every(result => result.status === 'success')

  res.status(200).json({
    timestamp: new Date().toISOString(),
    allTestsPassed,
    results
  })
} 