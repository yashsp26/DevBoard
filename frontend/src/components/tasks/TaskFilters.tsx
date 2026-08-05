import { useSearchParams } from 'react-router'
import { useLabels } from '../../services/useLabels'
import { useCurrentUser } from '../../services/useCurrentUser'
import { TaskPriority, TaskStatus } from '../../types/task'

const selectClassName = 'min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

export function TaskFilters({ projectId }: { projectId: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: labels } = useLabels(projectId)
  const { data: currentUser } = useCurrentUser()
  const setFilter = (key: string, value: string) => setSearchParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); next.delete('page'); return next })
  return <div className="flex flex-wrap gap-3"><label className="sr-only" htmlFor="task-status">Status</label><select className={selectClassName} id="task-status" onChange={(event) => setFilter('status', event.target.value)} value={searchParams.get('status') ?? ''}><option value="">All statuses</option>{Object.values(TaskStatus).map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><label className="sr-only" htmlFor="task-priority">Priority</label><select className={selectClassName} id="task-priority" onChange={(event) => setFilter('priority', event.target.value)} value={searchParams.get('priority') ?? ''}><option value="">All priorities</option>{Object.values(TaskPriority).map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select><label className="sr-only" htmlFor="task-assignee">Assignee</label><select className={selectClassName} id="task-assignee" onChange={(event) => setFilter('assigneeId', event.target.value)} value={searchParams.get('assigneeId') ?? ''}><option value="">All assignees</option>{currentUser && <option value={currentUser.id}>{currentUser.name}</option>}</select><label className="sr-only" htmlFor="task-label">Label</label><select className={selectClassName} id="task-label" onChange={(event) => setFilter('labelId', event.target.value)} value={searchParams.get('labelId') ?? ''}><option value="">All labels</option>{labels?.map((label) => <option key={label.id} value={label.id}>{label.name}</option>)}</select></div>
}
