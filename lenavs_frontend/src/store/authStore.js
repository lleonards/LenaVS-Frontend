import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,

  setAuth: (user, session) =>
    set({
      user,
      session,
      isAuthenticated: true
    }),

  logout: () =>
    set({
      user: null,
      session: null,
      isAuthenticated: false
    })
}))
