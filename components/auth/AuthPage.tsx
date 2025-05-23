import React, { useState } from 'react'
import { LoginForm } from './login/LoginForm'
import { SignupForm } from './signup/SignupForm'
import { ActivityIcon } from 'lucide-react'

interface AuthPageProps {
  defaultTab?: 'login' | 'signup'
}

export const AuthPage = ({ defaultTab = 'login' }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(defaultTab === 'login')

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ActivityIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">FitTrack</span>
          </div>
          <p className="text-gray-600 font-medium">
            "Progress over perfection"
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex mb-4">
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
          <div className="p-6">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
