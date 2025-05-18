import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
})) 