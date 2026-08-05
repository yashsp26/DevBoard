import { queryOptions, useQuery } from '@tanstack/react-query'
import { taskService } from '../../services/task.service'
import type { TaskFilters } from '../../types/task'
import { taskQueryKeys } from './taskQueryKeys'

export const tasksQueryOptions = (projectId: string, filters: TaskFilters = {}) => queryOptions({
  queryKey: taskQueryKeys.list(projectId, filters),
  queryFn: () => taskService.getTasks(projectId, filters),
  enabled: Boolean(projectId),
})

export function useTasks(projectId: string | undefined, filters: TaskFilters = {}) {
  return useQuery({ ...tasksQueryOptions(projectId ?? '', filters), enabled: Boolean(projectId) })
}
