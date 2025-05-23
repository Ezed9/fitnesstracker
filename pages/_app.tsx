import React from 'react'
import '@/styles/globals.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, useEffect, Component, ErrorInfo } from 'react'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'

type ErrorBoundaryProps = {
  error: Error | null
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          statusCode={500}
          title="Something went wrong"
        />
      )
    }

    return this.props.children
  }
}

type AppPageProps = {
  err?: Error
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // In a production app, you might want to send these metrics to an analytics service
  // For now, we'll just log them to the console
  switch (metric.name) {
    case 'FCP':
      console.log('First Contentful Paint:', metric.value)
      break
    case 'LCP':
      console.log('Largest Contentful Paint:', metric.value)
      break
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric.value)
      break
    case 'FID':
      console.log('First Input Delay:', metric.value)
      break
    case 'TTFB':
      console.log('Time to First Byte:', metric.value)
      break
    default:
      console.log(metric.name, metric.value)
  }
}

export default function App({
  Component,
  pageProps,
  err,
}: AppProps & { err?: Error }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const router = useRouter()

  // Handle route changes and errors
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Track page views or analytics here
      console.log(`Navigated to: ${url}`)
    }


    const handleError = (err: any) => {
      console.error('Route change error:', err)
      // You can redirect to an error page or show a notification
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeError', handleError)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeError', handleError)
    }
  }, [router.events])

  // Handle unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason)
      // Optionally send to an error tracking service
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Handle client-side errors
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error caught by error boundary:', error, errorInfo)
    // Send error to error tracking service
  }

  return (
    <ErrorBoundary error={err || null}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} err={err} />
      </SessionContextProvider>
    </ErrorBoundary>
  )
}
