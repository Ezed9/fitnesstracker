import React from 'react'
import '@/styles/globals.css'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { createBrowserClient } from '@supabase/ssr'
import { useState, useEffect, Component, ErrorInfo } from 'react'
import { useRouter } from 'next/router'
import { useRouteChangeHandler } from '../hooks/useRouteChangeHandler'
import ErrorPage from 'next/error'
import Layout from '@/components/layout/Layout'

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

export default function App({ Component, pageProps, err }: AppProps & { err?: Error }) {
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  ))
  
  // Use the route change handler to suppress route cancellation errors
  useRouteChangeHandler()

  const [isLoading, setIsLoading] = useState(true);

  // Handle authentication state and routing
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // If no session and not on a public route, redirect to login
        if (!session && !['/login', '/signup', '/_error'].includes(router.pathname)) {
          await router.replace('/login');
        } 
        // If session exists and on auth pages, redirect to dashboard
        else if (session && ['/login', '/signup', '/', '/_error'].includes(router.pathname)) {
          await router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!['/login', '/signup', '/_error'].includes(router.pathname)) {
          await router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Handle route changes and errors
    const handleRouteChange = (url: string) => {
      console.log(`Navigated to: ${url}`)
    };

    const handleError = (err: any) => {
      console.error('Route change error:', err);
    };

    router.events.on('routeChangeStart', checkAuth);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', checkAuth);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleError);
    };
  }, [router, supabaseClient]);

  // Handle unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled rejection:', event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Handle client-side errors
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error caught by error boundary:', error, errorInfo);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        // If no session and not on a public route, redirect to login
        if (!session && !['/login', '/signup'].includes(router.pathname)) {
          router.replace('/login');
        } 
        // If session exists and on auth pages, redirect to dashboard
        else if (session && ['/login', '/signup', '/'].includes(router.pathname)) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!['/login', '/signup'].includes(router.pathname)) {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabaseClient]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't wrap auth pages with Layout
  const isAuthPage = ['/login', '/signup'].includes(router.pathname);

  return (
    <ErrorBoundary error={err || null}>
      {isAuthPage ? (
        <Component {...pageProps} err={err} supabase={supabaseClient} />
      ) : (
        <Layout>
          <Component {...pageProps} err={err} supabase={supabaseClient} />
        </Layout>
      )}
    </ErrorBoundary>
  )
}
