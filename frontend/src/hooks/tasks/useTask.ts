import { useQuery } from '@tanstack/react-query'
import { taskService } from '../../services/task.service'
import { taskQueryKeys } from './taskQueryKeys'

export function useTask(taskId: string | undefined) {
  return useQuery({
    queryKey: taskQueryKeys.detail(taskId ?? ''),
    queryFn: () => taskService.getTask(taskId!),
    enabled: Boolean(taskId),
  })
}
