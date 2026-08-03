import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { usersApi } from '../api/users'
import { getApiErrorMessage } from '../utils/apiError'
import { clearAuthSession } from './authSession'

export function useDeleteAccount() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: usersApi.deleteProfile,
    onSuccess: () => {
      clearAuthSession()
      toast.success('Your account has been deleted.')
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to delete your account. Please try again.'))
    },
  })
}
