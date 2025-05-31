import { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseContextType = {
  supabase: SupabaseClient;
};

export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

type SupabaseProviderProps = {
  children: ReactNode;
  supabase: SupabaseClient;
};

export const SupabaseProvider = ({
  children,
  supabase,
}: SupabaseProviderProps) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context.supabase;
};
