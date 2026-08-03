import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authApi } from '../api/auth'
import { clearAuthSession } from './authSession'

export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthSession()
      toast.success('You have been signed out.')
      navigate('/login', { replace: true })
    },
    onError: () => {
      toast.error('Unable to sign out. Please try again.')
    },
  })
}
