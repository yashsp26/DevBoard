import { queryOptions, useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
}

export const dashboardQueryOptions = () => queryOptions({
  queryKey: dashboardQueryKeys.all,
  queryFn: dashboardApi.getDashboard,
})

export function useDashboard() {
  return useQuery(dashboardQueryOptions())
}
