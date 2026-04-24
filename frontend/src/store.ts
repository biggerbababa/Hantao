import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Room, User } from './api'

interface AppState {
  room: Room | null
  user: User | null
  setSession: (room: Room, user: User) => void
  clearSession: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      room: null,
      user: null,
      setSession: (room, user) => set({ room, user }),
      clearSession: () => set({ room: null, user: null }),
    }),
    { name: 'hantao-session' }
  )
)
