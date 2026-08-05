import { ArrowLeft, ListTodo } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Project } from '../../types/project'

export function ProjectDetailsHeader({ isTasksPage = false, onBack, onOpenTasks, project }: { isTasksPage?: boolean; onBack: () => void; onOpenTasks?: () => void; project: Project }) {
  const archived = project.status === 'ARCHIVED'
  return <PageHeader actions={<>{onOpenTasks && <Button aria-current={isTasksPage ? 'page' : undefined} onClick={onOpenTasks} variant={isTasksPage ? 'primary' : 'secondary'}><ListTodo aria-hidden="true" className="size-4" />Tasks</Button>}<Button onClick={onBack} variant="secondary"><ArrowLeft aria-hidden="true" className="size-4" />All projects</Button></>} description={<span className="inline-flex items-center gap-2">Project workspace <Badge variant={archived ? 'warning' : 'success'}>{archived ? 'Archived' : 'Active'}</Badge></span>} title={project.name} />
}
