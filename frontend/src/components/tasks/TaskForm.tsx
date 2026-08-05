import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useLabels } from '../../services/useLabels'
import { useCurrentUser } from '../../services/useCurrentUser'
import { TaskPriority, type CreateTaskInput, type Task } from '../../types/task'

const taskFormSchema = z.object({ title: z.string().trim().min(1, 'Enter a task title.').max(200, 'Task title cannot exceed 200 characters.'), description: z.string().trim().max(2000, 'Description cannot exceed 2,000 characters.'), priority: z.enum(TaskPriority), dueDate: z.string().refine((value) => !value || !Number.isNaN(Date.parse(value)), 'Enter a valid due date.'), assigneeId: z.string(), labelIds: z.array(z.string()) })
type TaskFormValues = z.infer<typeof taskFormSchema>

export interface TaskFormProps {
  defaultTask?: Task
  error?: Error | null
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (input: CreateTaskInput) => void
  projectId: string
  submitLabel: string
}

export function TaskForm({ defaultTask, error, isSubmitting, onCancel, onSubmit, projectId, submitLabel }: TaskFormProps) {
  const { data: labels } = useLabels(projectId)
  const { data: currentUser } = useCurrentUser()
  const { formState: { errors }, handleSubmit, register, reset } = useForm<TaskFormValues>({ defaultValues: { assigneeId: '', description: '', dueDate: '', labelIds: [], priority: TaskPriority.MEDIUM, title: '' }, resolver: zodResolver(taskFormSchema) })
  useEffect(() => { reset({ assigneeId: defaultTask?.assigneeId ?? currentUser?.id ?? '', description: defaultTask?.description ?? '', dueDate: defaultTask?.dueDate ? defaultTask.dueDate.slice(0, 10) : '', labelIds: defaultTask?.labelIds ?? defaultTask?.labels.map((label) => label.id) ?? [], priority: defaultTask?.priority ?? TaskPriority.MEDIUM, title: defaultTask?.title ?? '' }) }, [currentUser, defaultTask, reset])
  return <form className="space-y-5" noValidate onSubmit={handleSubmit((values) => onSubmit({ ...values, assigneeId: values.assigneeId || undefined, dueDate: values.dueDate || null }))}>{error && <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger" role="alert">Unable to save the task. Please review the fields and try again.</div>}<Input autoFocus disabled={isSubmitting} error={errors.title?.message} label="Task title" {...register('title')} /><Textarea disabled={isSubmitting} error={errors.description?.message} label="Description" {...register('description')} /><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-text" htmlFor="task-priority">Priority<select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text" disabled={isSubmitting} id="task-priority" {...register('priority')}>{Object.values(TaskPriority).map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></label><Input disabled={isSubmitting} error={errors.dueDate?.message} label="Due date" type="date" {...register('dueDate')} /></div><label className="grid gap-2 text-sm font-medium text-text" htmlFor="task-assignee">Assignee<select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text" disabled={isSubmitting} id="task-assignee" {...register('assigneeId')}><option value="">Unassigned</option>{currentUser && <option value={currentUser.id}>{currentUser.name}</option>}</select></label><label className="grid gap-2 text-sm font-medium text-text" htmlFor="task-labels">Labels<select className="min-h-28 rounded-lg border border-border bg-app px-3 py-2 text-sm text-text" disabled={isSubmitting} id="task-labels" multiple {...register('labelIds')}>{labels?.map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}</select></label><div className="flex justify-end gap-3"><Button disabled={isSubmitting} onClick={onCancel} variant="secondary">Cancel</Button><Button isLoading={isSubmitting} type="submit">{submitLabel}</Button></div></form>
}
