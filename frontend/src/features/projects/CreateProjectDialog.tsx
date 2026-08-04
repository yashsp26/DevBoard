import { ProjectFormDialog } from './ProjectFormDialog'

type CreateProjectDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
  return <ProjectFormDialog isOpen={isOpen} onClose={onClose} />
}
