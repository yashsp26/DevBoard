import { Badge } from '../ui/Badge'
import { TaskStatus } from '../../types/task'

export interface TaskStatusBadgeProps {
  status: TaskStatus
}

const statusStyles: Record<TaskStatus, { label: string; variant: 'default' | 'info' | 'warning' | 'success' }> = {
  [TaskStatus.TODO]: { label: 'To do', variant: 'default' },
  [TaskStatus.IN_PROGRESS]: { label: 'In progress', variant: 'info' },
  [TaskStatus.REVIEW]: { label: 'Review', variant: 'warning' },
  [TaskStatus.DONE]: { label: 'Done', variant: 'success' },
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const { label, variant } = statusStyles[status]
  return <Badge aria-label={`Status: ${label}`} variant={variant}>{label}</Badge>
}
