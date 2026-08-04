import { ProjectCard } from './ProjectCard'
import type { Project } from '../../types/project'

type ProjectGridProps = {
  archivingProjectId?: string
  deletingProjectId?: string
  onArchive: (project: Project) => void
  onDelete: (project: Project) => void
  onEdit: (project: Project) => void
  onOpen: (project: Project) => void
  onToggleFavorite: (project: Project) => void
  projects: Project[]
  togglingFavoriteProjectId?: string
}

export function ProjectGrid({ archivingProjectId, deletingProjectId, onArchive, onDelete, onEdit, onOpen, onToggleFavorite, projects, togglingFavoriteProjectId }: ProjectGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          isArchiving={archivingProjectId === project.id}
          isDeleting={deletingProjectId === project.id}
          isTogglingFavorite={togglingFavoriteProjectId === project.id}
          key={project.id}
          onArchive={onArchive}
          onDelete={onDelete}
          onEdit={onEdit}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
          project={project}
        />
      ))}
    </div>
  )
}
