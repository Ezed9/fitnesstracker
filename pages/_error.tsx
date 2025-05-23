import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface ErrorProps {
  statusCode: number
  title?: string
  message?: string
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, title, message }) => {
  const router = useRouter()
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(`Error ${statusCode}: ${message || 'An error occurred'}`)
  }, [statusCode, message])

  const errorMessages: Record<number, { title: string; message: string }> = {
    400: {
      title: 'Bad Request',
      message: 'The server cannot process the request due to a client error.'
    },
    401: {
      title: 'Unauthorized',
      message: 'You need to be logged in to access this page.'
    },
    403: {
      title: 'Forbidden',
      message: 'You do not have permission to access this resource.'
    },
    404: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist or has been moved.'
    },
    500: {
      title: 'Internal Server Error',
      message: 'An unexpected error occurred on the server.'
    }
  }

  const error = errorMessages[statusCode as keyof typeof errorMessages] || {
    title: title || 'An error occurred',
    message: message || 'Please try again later.'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{statusCode || 'Error'}</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{error.title}</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Go to Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && statusCode >= 500 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
            <details>
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">Error details</summary>
              <div className="mt-2 text-xs text-gray-600 overflow-auto">
                {message && <p>{message}</p>}
                <p>Status code: {statusCode}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode || 500 : 404
  return { statusCode }
}

export default ErrorPage
