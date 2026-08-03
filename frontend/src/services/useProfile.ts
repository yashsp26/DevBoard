import { queryOptions, useQuery } from '@tanstack/react-query'
import { usersApi } from '../api/users'

export const profileQueryKey = ['users', 'profile'] as const

export const profileQueryOptions = () =>
  queryOptions({
    queryKey: profileQueryKey,
    queryFn: usersApi.getProfile,
  })

export function useProfile() {
  return useQuery(profileQueryOptions())
}
