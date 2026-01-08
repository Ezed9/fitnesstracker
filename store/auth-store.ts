import { create } from 'zustand'
import { User, SupabaseClient } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  signOut: (supabase: SupabaseClient) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  signOut: async (supabase: SupabaseClient) => {
    await supabase.auth.signOut()
    set({ user: null })
  },
})) 