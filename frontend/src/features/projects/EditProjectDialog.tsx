import { ProjectFormDialog } from './ProjectFormDialog'
import type { Project } from '../../types/project'

type EditProjectDialogProps = {
  onClose: () => void
  project?: Project
}

export function EditProjectDialog({ onClose, project }: EditProjectDialogProps) {
  return <ProjectFormDialog isOpen={Boolean(project)} onClose={onClose} project={project} />
}
