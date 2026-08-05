import { create } from 'zustand'
import { queryClient } from '../lib/queryClient'
import { currentUserQueryOptions } from '../services/useCurrentUser'
import { authService } from '../services/authService'
import type { AuthUser } from '../types/auth'

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
  initialize: () => Promise<void>
  refresh: () => Promise<string | null>
  fetchCurrentUser: () => Promise<AuthUser | null>
}

let initializationPromise: Promise<void> | null = null

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, accessToken) => {
    set({ accessToken, user, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => {
    set({ accessToken })
    void queryClient.invalidateQueries({ queryKey: currentUserQueryOptions().queryKey })
  },

  logout: () => {
    set({ accessToken: null, user: null, isAuthenticated: false })
    queryClient.removeQueries({ queryKey: ['auth'] })
  },

  refresh: async () => {
    try {
      const accessToken = await authService.refresh()
      get().setAccessToken(accessToken)
      return accessToken
    } catch {
      get().logout()
      return null
    }
  },

  fetchCurrentUser: async () => {
    const accessToken = get().accessToken

    if (!accessToken) {
      return null
    }

    try {
      const user = await queryClient.fetchQuery(currentUserQueryOptions());
      get().login(user, accessToken);
      return user;
    } catch {
      return null;
    }
  },

  initialize: async () => {
    if (!initializationPromise) {
      initializationPromise = (async () => {
        try {
          set({ isLoading: true });
          const existingAccessToken = get().accessToken

          if (existingAccessToken) {
            await get().fetchCurrentUser()
            return
          }

          const refreshedAccessToken = await get().refresh()
          if (refreshedAccessToken) {
            await get().fetchCurrentUser()
          }
        } finally {
          set({ isLoading: false });
          initializationPromise = null;
        }
      })();
    }

    return initializationPromise;
  },
}));
