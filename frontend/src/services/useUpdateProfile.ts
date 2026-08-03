import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi } from '../api/users'
import { queryClient } from '../lib/queryClient'
import type { Profile, UpdateProfilePayload } from '../types/profile'
import { getApiErrorMessage } from '../utils/apiError'
import { profileQueryKey } from './useProfile'
import { currentUserQueryOptions } from './useCurrentUser'

export function useUpdateProfile() {
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onMutate: async (values: UpdateProfilePayload) => {
      await queryClient.cancelQueries({ queryKey: profileQueryKey })
      const previousProfile = queryClient.getQueryData<Profile>(profileQueryKey)

      queryClient.setQueryData<Profile>(profileQueryKey, (profile) => {
        if (!profile) {
          return profile
        }

        const { name, ...profileUpdates } = values

        return {
          ...profile,
          ...(name ? { name } : {}),
          profile: profile.profile ? { ...profile.profile, ...profileUpdates } : profile.profile,
        }
      })

      return { previousProfile }
    },
    onError: (error, _values, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(profileQueryKey, context.previousProfile)
      }

      toast.error(getApiErrorMessage(error, 'Unable to update your profile. Please try again.'))
    },
    onSuccess: () => {
      toast.success('Profile updated.')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKey })
      void queryClient.invalidateQueries({ queryKey: currentUserQueryOptions().queryKey })
    },
  })
}
