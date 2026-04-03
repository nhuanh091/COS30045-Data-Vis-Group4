import { create } from 'zustand'

export const useStore = create((set) => ({
  user: {
    name: 'User',
    email: 'user@example.com'
  },
  setUser: (user) => set({ user }),
}))
