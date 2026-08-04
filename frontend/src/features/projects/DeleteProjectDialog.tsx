import { Dialog } from '../../components/ui/Dialog'
import type { Project } from '../../types/project'

type DeleteProjectDialogProps = {
  isDeleting: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  project: Project
}

export function DeleteProjectDialog({ isDeleting, isOpen, onClose, onConfirm, project }: DeleteProjectDialogProps) {
  return (
    <Dialog
      confirmLabel="Delete project"
      isLoading={isDeleting}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete this project?"
      variant="danger"
    >
      <p>This permanently deletes <strong className="font-semibold text-text">{project.name}</strong>, including its tasks, notes, snippets, and labels. This action cannot be undone.</p>
    </Dialog>
  )
}
