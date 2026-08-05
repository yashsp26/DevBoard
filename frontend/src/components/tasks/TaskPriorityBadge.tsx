import { Badge } from '../ui/Badge'
import { TaskPriority } from '../../types/task'

export interface TaskPriorityBadgeProps {
  priority: TaskPriority
}

const priorityStyles: Record<TaskPriority, { label: string; variant: 'default' | 'info' | 'warning' | 'danger' }> = {
  [TaskPriority.LOW]: { label: 'Low', variant: 'default' },
  [TaskPriority.MEDIUM]: { label: 'Medium', variant: 'info' },
  [TaskPriority.HIGH]: { label: 'High', variant: 'warning' },
  [TaskPriority.CRITICAL]: { label: 'Critical', variant: 'danger' },
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const { label, variant } = priorityStyles[priority]
  return <Badge aria-label={`Priority: ${label}`} variant={variant}>{label}</Badge>
}
