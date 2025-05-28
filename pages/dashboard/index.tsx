import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { createBrowserClient } from '@supabase/ssr';
import DashboardComponent from '@/components/dashboard/Dashboard/index';

export default function DashboardPage({ supabase }: { supabase?: any }) {
  const router = useRouter();
  // Use the passed-in supabase client or create a new one if not provided
  const supabaseClient = supabase || createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router, supabaseClient]);

  return <DashboardComponent />;
}
