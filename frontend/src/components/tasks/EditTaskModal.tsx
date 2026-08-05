import { Modal } from '../ui/Modal'
import { useUpdateTask } from '../../hooks/tasks/useUpdateTask'
import type { Task } from '../../types/task'
import { TaskForm } from './TaskForm'

export function EditTaskModal({ onClose, task }: { onClose: () => void; task?: Task }) {
  const updateTask = useUpdateTask(task?.id ?? '')
  return <Modal isOpen={Boolean(task)} onClose={onClose} title="Edit task">{task && <TaskForm defaultTask={task} error={updateTask.error} isSubmitting={updateTask.isPending} onCancel={onClose} onSubmit={(input) => updateTask.mutate(input, { onSuccess: onClose })} projectId={task.projectId} submitLabel="Save changes" />}</Modal>
}
