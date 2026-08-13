import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useId } from 'react'
import { useCreateTask } from '../../hooks/tasks/useCreateTask'
import { TaskForm } from './TaskForm'

export function CreateTaskModal({ isOpen, onClose, projectId }: { isOpen: boolean; onClose: () => void; projectId: string }) {
  const createTask = useCreateTask(projectId)
  const formId = useId()
  return <Modal footer={<div className="ml-auto flex items-center gap-3"><Button disabled={createTask.isPending} onClick={onClose} variant="secondary">Cancel</Button><Button form={formId} isLoading={createTask.isPending} type="submit">Create task</Button></div>} isOpen={isOpen} onClose={onClose} size="medium" title="Create task"><TaskForm error={createTask.error} formId={formId} isSubmitting={createTask.isPending} onCancel={onClose} onSubmit={(input) => createTask.mutate(input, { onSuccess: onClose })} projectId={projectId} submitLabel="Create task" /></Modal>
}
