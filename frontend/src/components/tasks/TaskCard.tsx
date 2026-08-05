import { CalendarDays } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'
import type { Task } from '../../types/task'
import { TaskLabel } from './TaskLabel'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'

export interface TaskCardProps {
  onClick?: (task: Task) => void
  task: Task
}

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))

export function TaskCard({ onClick, task }: TaskCardProps) {
  const isInteractive = Boolean(onClick)
  const openTask = () => onClick?.(task)
  return <Card aria-label={isInteractive ? `Open task ${task.title}` : undefined} className={cn('flex min-h-56 flex-col p-5', isInteractive && 'cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary')} onClick={openTask} onKeyDown={(event) => { if (isInteractive && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openTask() } }} role={isInteractive ? 'button' : undefined} tabIndex={isInteractive ? 0 : undefined}><div className="flex flex-wrap items-start justify-between gap-3"><h3 className="min-w-0 flex-1 text-base font-semibold text-text">{task.title}</h3><TaskPriorityBadge priority={task.priority} /></div><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{task.description || 'No description added.'}</p><div className="mt-4 flex flex-wrap gap-2"><TaskStatusBadge status={task.status} />{task.labels.map((label) => <TaskLabel key={label.id} label={label} />)}</div><div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted"><span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3.5" />{task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}</span><span className="flex items-center gap-2"><Avatar alt={task.assignee ? `${task.assignee.name}'s avatar` : 'Unassigned'} size="sm" /><span className="max-w-24 truncate">{task.assignee?.name ?? 'Unassigned'}</span></span></div><p className="mt-3 text-xs text-muted">Updated {formatDate(task.updatedAt)}</p></Card>
}
