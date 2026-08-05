import type { TaskFilters } from '../../types/task'

export function serializeTaskFilters(filters: TaskFilters = {}) {
  return JSON.stringify(Object.entries(filters).filter(([, value]) => value !== undefined).sort(([left], [right]) => left.localeCompare(right)))
}

export const taskQueryKeys = {
  all: ['tasks'] as const,
  detail: (taskId: string) => [...taskQueryKeys.all, 'detail', taskId] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  projectLists: (projectId: string) => [...taskQueryKeys.lists(), projectId] as const,
  list: (projectId: string, filters: TaskFilters = {}) => [...taskQueryKeys.lists(), projectId, serializeTaskFilters(filters)] as const,
}
