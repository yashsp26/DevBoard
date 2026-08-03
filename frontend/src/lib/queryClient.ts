import { QueryClient } from '@tanstack/react-query'

/**
 * Query keys use resource namespaces and stable arrays: ['auth', 'current-user'], ['users', 'profile'].
 * Keep query parameters as later array entries; do not use concatenated string keys.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
