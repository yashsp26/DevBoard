import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '../lib/queryClient'
import { userService } from '../services/userService'
import { getApiErrorMessage } from '../utils/apiError'
import { meQueryKey } from './useAuth'

export const avatarQueryKey = ['users', 'avatar'] as const
const profileQueryKey = ['users', 'profile'] as const

export const avatarQueryOptions = () =>
  queryOptions({
    queryKey: avatarQueryKey,
    queryFn: userService.getAvatar,
  })

export function useAvatar() {
  return useQuery(avatarQueryOptions())
}

export function useAvatarUploadUrl() {
  return useMutation({
    mutationFn: ({ fileName }: { fileName: string }) => userService.getAvatarUploadUrl(fileName),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to prepare your avatar upload. Please try again.')),
  })
}

export function useSaveAvatar() {
  return useMutation({
    mutationFn: ({ path }: { path: string }) => userService.saveAvatar(path),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: avatarQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
      ])
      toast.success('Avatar updated.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to save your avatar. Please try again.')),
  })
}

export function useDeleteAvatar() {
  return useMutation({
    mutationFn: userService.deleteAvatar,
    onSuccess: async () => {
      queryClient.setQueryData(avatarQueryKey, null)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
      ])
      toast.success('Avatar removed.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to remove your avatar. Please try again.')),
  })
}
