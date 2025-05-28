import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * A custom hook to suppress route change errors that are related to route cancellation.
 * This is a common issue in Next.js applications when routes change rapidly or
 * when a component is unmounted during a route change.
 */
export function useRouteChangeHandler() {
  const router = useRouter();

  useEffect(() => {
    // This handler suppresses the error
    const handleRouteChangeError = (err: any) => {
      // If the error is just a cancelled route, we can safely ignore it
      if (err?.cancelled) {
        // This is a normal part of the Next.js router lifecycle, not an actual error
        console.log('Route change was cancelled. This is expected behavior.');
        return;
      }
      
      // For any other errors, we should log them
      console.error('Navigation error:', err);
    };

    // Add event listeners for route change events
    router.events.on('routeChangeError', handleRouteChangeError);

    // Clean up event listeners on component unmount
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return null;
}
