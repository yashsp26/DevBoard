import { Archive, Box, FileText, FolderKanban, Tag } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { useProject } from '../../services/useProjects'
import type { Project } from '../../types/project'

type ProjectDetailsDialogProps = {
  onClose: () => void
  project?: Project
}

export function ProjectDetailsDialog({ onClose, project }: ProjectDetailsDialogProps) {
  const { data: detailedProject, isLoading } = useProject(project?.id)
  const displayedProject = detailedProject && project
    ? { ...project, ...detailedProject, _count: detailedProject._count ?? project._count }
    : detailedProject ?? project

  return (
    <Modal isOpen={Boolean(project)} onClose={onClose} title={project?.name ?? 'Project details'}>
      {isLoading || !displayedProject ? <div className="space-y-4"><Skeleton className="h-7 w-1/2" /><Skeleton className="h-20 w-full" /><Skeleton className="h-16 w-full" /></div> : (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <span aria-label="Project color" className="mt-0.5 size-9 shrink-0 rounded-lg border border-border-subtle" style={{ backgroundColor: displayedProject.color ?? 'var(--color-primary)' }} />
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold text-text">{displayedProject.name}</h3><Badge variant={displayedProject.status === 'ARCHIVED' ? 'warning' : 'success'}>{displayedProject.status === 'ARCHIVED' ? 'Archived' : 'Active'}</Badge></div><p className="mt-2 text-sm leading-6 text-muted">{displayedProject.description || 'No description added.'}</p></div>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-app p-4 text-sm text-muted">
            <div className="flex items-center gap-2"><FolderKanban aria-hidden="true" className="size-4" /><dt className="sr-only">Tasks</dt><dd>{displayedProject._count?.tasks ?? 0} tasks</dd></div>
            <div className="flex items-center gap-2"><FileText aria-hidden="true" className="size-4" /><dt className="sr-only">Notes</dt><dd>{displayedProject._count?.notes ?? 0} notes</dd></div>
            <div className="flex items-center gap-2"><Box aria-hidden="true" className="size-4" /><dt className="sr-only">Snippets</dt><dd>{displayedProject._count?.snippets ?? 0} snippets</dd></div>
            <div className="flex items-center gap-2"><Tag aria-hidden="true" className="size-4" /><dt className="sr-only">Labels</dt><dd>{displayedProject._count?.labels ?? 0} labels</dd></div>
          </dl>
          <p className="flex items-center gap-2 text-sm text-muted"><Archive aria-hidden="true" className="size-4" />Updated {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(displayedProject.updatedAt))}</p>
        </div>
      )}
    </Modal>
  )
}
