import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from '../api/users'
import type { ChangePasswordPayload } from '../types/profile'
import { getApiErrorMessage } from '../utils/apiError'

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => usersApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password updated.')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to update your password. Please try again.'))
    },
  })
}
