import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Check for signup success message
  useEffect(() => {
    if (router.query.signup === 'success') {
      alert('Sign up successful! Please check your email to confirm your account.')
      // Remove the query param without refreshing
      router.replace('/login', undefined, { shallow: true })
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) throw error
      
      if (!data.session) {
        throw new Error('No session returned after login')
      }
      
      // Redirect to dashboard after successful login
      router.push('/')
    } catch (error: any) {
      console.error('Login error:', error)
      
      // More user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in. Check your inbox.')
      } else {
        setError('An error occurred during login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Head>
        <title>Login | FitTrack</title>
        <meta name="description" content="Login to your FitTrack account" />
      </Head>
      
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to FitTrack
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}