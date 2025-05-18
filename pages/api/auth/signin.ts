import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/utils/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ 
      message: 'Login successful!',
      session: data.session,
      user: data.user 
    })
  } catch (error) {
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An error occurred during login' 
    })
  }
} 