import { CalendarDays } from 'lucide-react'
import { type ReactNode } from 'react'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/cn'
import type { Task } from '../../types/task'
import { TaskLabel } from './TaskLabel'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'

export interface TaskRowProps {
  actions?: ReactNode
  onClick?: (task: Task) => void
  task: Task
}

export function TaskRow({ actions, onClick, task }: TaskRowProps) {
  const interactive = Boolean(onClick)
  const openTask = () => onClick?.(task)
  return <article aria-label={interactive ? `Open task ${task.title}` : undefined} className={cn('grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]', interactive && 'cursor-pointer transition-colors hover:bg-app focus-visible:outline-2 focus-visible:outline-primary')} onClick={openTask} onKeyDown={(event) => { if (interactive && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openTask() } }} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined}><div className="min-w-0"><h3 className="truncate font-medium text-text">{task.title}</h3><div className="mt-2 flex flex-wrap gap-2">{task.labels.map((label) => <TaskLabel key={label.id} label={label} />)}</div></div><div className="flex items-center gap-2"><TaskPriorityBadge priority={task.priority} /><TaskStatusBadge status={task.status} /></div><span className="inline-flex items-center gap-1.5 text-sm text-muted"><CalendarDays aria-hidden="true" className="size-4" />{task.dueDate ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(task.dueDate)) : 'No due date'}</span><span className="flex items-center gap-2 text-sm text-muted"><Avatar alt={task.assignee ? `${task.assignee.name}'s avatar` : 'Unassigned'} size="sm" />{task.assignee?.name ?? 'Unassigned'}</span>{actions && <div className="flex items-center gap-2 sm:justify-end">{actions}</div>}<p className="text-xs text-muted sm:col-span-4">Updated {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(task.updatedAt))}</p></article>
}
