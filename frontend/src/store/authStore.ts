import { create } from 'zustand'
import { queryClient } from '../lib/queryClient'
import { currentUserQueryOptions } from '../services/useCurrentUser'
import type { AuthUser } from '../types/auth'

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser, accessToken: string) => void
  setAccessToken: (accessToken: string) => void
  logout: () => void
  initializeAuth: () => Promise<void>
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
  },

  logout: () => {
    set({ accessToken: null, user: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    const accessToken = get().accessToken

    if (!accessToken) {
      get().logout()
      return null
    }

    try {
      const user = await queryClient.fetchQuery(currentUserQueryOptions());
      get().login(user, accessToken);
      return user;
    } catch {
      get().logout();
      return null;
    }
  },

  initializeAuth: async () => {
    if (!initializationPromise) {
      initializationPromise = (async () => {
        try {
          set({ isLoading: true });
          await get().fetchCurrentUser();
        } finally {
          set({ isLoading: false });
          initializationPromise = null;
        }
      })();
    }

    return initializationPromise;
  },
}));
