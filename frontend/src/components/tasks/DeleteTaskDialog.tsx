import { Dialog } from '../ui/Dialog'
import { useDeleteTask } from '../../hooks/tasks/useDeleteTask'
import type { Task } from '../../types/task'

export interface DeleteTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
  task: Task
}

export function DeleteTaskDialog({ isOpen, onClose, onDeleted, task }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask(task)
  return <Dialog confirmLabel="Delete task" isLoading={deleteTask.isPending} isOpen={isOpen} onClose={onClose} onConfirm={() => deleteTask.mutate(undefined, { onSuccess: onDeleted })} title="Delete this task?" variant="danger">This permanently deletes <strong className="font-semibold text-text">{task.title}</strong>. This action cannot be undone.</Dialog>
}
