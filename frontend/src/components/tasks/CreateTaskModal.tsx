import { Modal } from '../ui/Modal'
import { useCreateTask } from '../../hooks/tasks/useCreateTask'
import { TaskForm } from './TaskForm'

export function CreateTaskModal({ isOpen, onClose, projectId }: { isOpen: boolean; onClose: () => void; projectId: string }) {
  const createTask = useCreateTask(projectId)
  return <Modal isOpen={isOpen} onClose={onClose} title="Create task"><TaskForm error={createTask.error} isSubmitting={createTask.isPending} onCancel={onClose} onSubmit={(input) => createTask.mutate(input, { onSuccess: onClose })} projectId={projectId} submitLabel="Create task" /></Modal>
}
