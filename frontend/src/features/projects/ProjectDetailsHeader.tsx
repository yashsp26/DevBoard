import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Project } from '../../types/project'

export function ProjectDetailsHeader({ onBack, project }: { onBack: () => void; project: Project }) {
  const archived = project.status === 'ARCHIVED'
  return <PageHeader actions={<Button onClick={onBack} variant="secondary"><ArrowLeft aria-hidden="true" className="size-4" />All projects</Button>} description={<span className="inline-flex items-center gap-2">Project workspace <Badge variant={archived ? 'warning' : 'success'}>{archived ? 'Archived' : 'Active'}</Badge></span>} title={project.name} />
}
