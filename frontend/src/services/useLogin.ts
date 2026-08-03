import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '../api/auth'
import { meQueryKey } from '../hooks/useAuth'
import { queryClient } from '../lib/queryClient'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials } from '../types/auth'
import { getApiErrorMessage } from '../utils/apiError'

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { accessToken } = await authApi.login(credentials)
      useAuthStore.getState().setAccessToken(accessToken)
      const user = await authApi.me()
      queryClient.setQueryData(meQueryKey, user)
      return { accessToken, user }
    },
    onSuccess: ({ accessToken, user }) => {
      useAuthStore.getState().login(user, accessToken)
      toast.success('Welcome back.')
    },
    onError: (error) => {
      useAuthStore.getState().logout()
      toast.error(getApiErrorMessage(error, 'Unable to sign in. Please try again.'))
    },
  })
}
