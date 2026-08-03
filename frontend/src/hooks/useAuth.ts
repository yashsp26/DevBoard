import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '../services/authService'
import type { ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth'
import { getApiErrorMessage } from '../utils/apiError'

export const meQueryKey = ['auth', 'me'] as const

export const meQueryOptions = () =>
  queryOptions({
    queryKey: meQueryKey,
    queryFn: authService.me,
  })

export function useMe() {
  return useQuery(meQueryOptions())
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (request: ForgotPasswordRequest) => authService.forgotPassword(request),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to send the reset link. Please try again.')),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => authService.resetPassword(request),
  })
}
