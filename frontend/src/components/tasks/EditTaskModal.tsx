import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useId } from 'react'
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask'
import type { Task } from '../../types/task'
import { TaskForm } from './TaskForm'

export function EditTaskModal({ onClose, task }: { onClose: () => void; task?: Task }) {
  const updateTask = useUpdateTask(task?.id ?? '')
  const formId = useId()
  return <Modal footer={<div className="ml-auto flex items-center gap-3"><Button disabled={updateTask.isPending} onClick={onClose} variant="secondary">Cancel</Button><Button form={formId} isLoading={updateTask.isPending} type="submit">Save changes</Button></div>} isOpen={Boolean(task)} onClose={onClose} size="medium" title="Edit task">{task && <TaskForm defaultTask={task} error={updateTask.error} formId={formId} isSubmitting={updateTask.isPending} onCancel={onClose} onSubmit={(input) => updateTask.mutate(input, { onSuccess: onClose })} projectId={task.projectId} submitLabel="Save changes" />}</Modal>
}
