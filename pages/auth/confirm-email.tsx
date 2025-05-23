import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { MailCheck } from 'lucide-react'

export default function ConfirmEmail() {
  const router = useRouter()
  const { email } = router.query

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <MailCheck className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-gray-600">
          We've sent a confirmation link to{' '}
          <span className="font-medium text-gray-900">{email || 'your email'}</span>.
          Please click the link to verify your account.
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Didn't receive an email?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Resend confirmation
            </button>
          </p>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Already confirmed your email?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
