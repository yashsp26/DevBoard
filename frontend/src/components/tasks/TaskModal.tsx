import { isAxiosError } from 'axios'
import { AlertCircle, CalendarDays, Edit3, Trash2, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTask } from '../../hooks/tasks/useTask'
import { useUpdateTaskStatus } from '../../hooks/tasks/useUpdateTaskStatus'
import { TaskStatus } from '../../types/task'
import { getApiErrorMessage } from '../../utils/apiError'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Skeleton } from '../ui/Skeleton'
import { DeleteTaskDialog } from './DeleteTaskDialog'
import { TaskLabel } from './TaskLabel'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'

export interface TaskModalProps {
  onClose: () => void
  onEdit?: (taskId: string) => void
  taskId?: string
}

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

export function TaskModal({ onClose, onEdit, taskId }: TaskModalProps) {
  const { data: task, error, isError, isLoading, refetch } = useTask(taskId)
  const updateStatus = useUpdateTaskStatus(taskId ?? '', task?.projectId)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isMissing = isAxiosError(error) && error.response?.status === 404

  useEffect(() => { if (isError && !isMissing) toast.error(getApiErrorMessage(error, 'Unable to load the task. Please try again.')) }, [error, isError, isMissing])

  return <Modal isOpen={Boolean(taskId)} onClose={onClose} title={task?.title ?? 'Task details'}>{isLoading ? <div aria-label="Loading task" className="space-y-5" role="status"><Skeleton className="h-7 w-2/3" /><Skeleton className="h-20 w-full" /><Skeleton className="h-16 w-full" /></div> : isError ? <div className="space-y-4 text-center"><AlertCircle aria-hidden="true" className="mx-auto size-8 text-danger" /><div><h3 className="font-semibold text-text">{isMissing ? 'Task not found' : 'Task unavailable'}</h3><p className="mt-1 text-sm text-muted">{isMissing ? 'This task does not exist or is no longer available.' : 'We couldn’t load this task. Please try again.'}</p></div>{!isMissing && <Button onClick={() => void refetch()} variant="secondary">Try again</Button>}</div> : task ? <div className="space-y-6"><div><div className="flex flex-wrap items-center gap-2"><TaskPriorityBadge priority={task.priority} /><TaskStatusBadge status={task.status} /></div><p className="mt-4 text-sm leading-6 text-muted">{task.description || 'No description added.'}</p></div><div className="flex flex-wrap gap-2">{task.labels.map((label) => <TaskLabel key={label.id} label={label} />)}</div><dl className="grid gap-4 rounded-xl border border-border bg-app p-4 text-sm text-muted sm:grid-cols-2"><div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4" /><dt className="sr-only">Due date</dt><dd>{task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}</dd></div><div className="flex items-center gap-2"><UserRound aria-hidden="true" className="size-4" /><dt className="sr-only">Assignee</dt><dd className="flex items-center gap-2"><Avatar alt={task.assignee ? `${task.assignee.name}'s avatar` : 'Unassigned'} size="sm" />{task.assignee?.name ?? 'Unassigned'}</dd></div><div className="sm:col-span-2"><dt className="sr-only">Created</dt><dd>Created {formatDate(task.createdAt)}</dd></div></dl><label className="grid gap-2 text-sm font-medium text-text" htmlFor="task-detail-status">Status<select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" disabled={updateStatus.isPending} id="task-detail-status" onChange={(event) => updateStatus.mutate(event.target.value as TaskStatus)} value={task.status}>{Object.values(TaskStatus).map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></label><div className="flex flex-wrap justify-end gap-3"><Button onClick={() => onEdit?.(task.id)} variant="secondary"><Edit3 aria-hidden="true" className="size-4" />Edit</Button><Button onClick={() => setIsDeleteOpen(true)} variant="danger"><Trash2 aria-hidden="true" className="size-4" />Delete</Button></div><DeleteTaskDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onDeleted={onClose} task={task} /></div> : null}</Modal>
}
