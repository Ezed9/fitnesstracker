import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/utils/supabase'

interface TableResult {
  status: 'success' | 'error'
  exists?: boolean
  message?: string
}

interface TestResults {
  [key: string]: TableResult
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test queries for each table
    const tables = ['workouts', 'exercises', 'exercise_sets', 'meals', 'weight_entries']
    const results: TestResults = {}

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        results[table] = { status: 'error', message: error.message }
      } else {
        results[table] = { status: 'success', exists: true }
      }
    }

    res.status(200).json({
      message: 'Database connection successful',
      tables: results
    })
  } catch (error) {
    console.error('Database test error:', error)
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 