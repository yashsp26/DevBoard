import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authApi } from '../api/auth'
import type { RegisterCredentials } from '../types/auth'
import { getApiErrorMessage } from '../utils/apiError'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: () => {
      toast.success('Registration successful. Please sign in.')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to create your account. Please try again.'))
    },
  })
}
