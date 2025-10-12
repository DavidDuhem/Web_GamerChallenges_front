import { create } from "zustand"
import type { AuthState } from "../types/auth"

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  isLoading: true,
  accessToken: null,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role === "admin",
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isLoading: false,
      accessToken: null,
    }),

  setAccessToken: (token: string | null) => set({ accessToken: token }),
}))
