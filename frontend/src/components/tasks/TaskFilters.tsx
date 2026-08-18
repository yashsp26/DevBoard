import { useSearchParams } from 'react-router'
import { useLabels } from '../../services/useLabels'
import { useCurrentUser } from '../../services/useCurrentUser'
import { TaskPriority, TaskStatus } from '../../types/task'
import { Select } from '../ui/Select'

export function TaskFilters({ projectId }: { projectId: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: labels } = useLabels(projectId)
  const { data: currentUser } = useCurrentUser()
  const setFilter = (key: string, value: string) => setSearchParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); next.delete('page'); return next })
  return <div className="flex flex-wrap gap-3"><Select aria-label="Status" onValueChange={(value) => setFilter('status', value as string)} options={[{ label: 'All statuses', value: '' }, ...Object.values(TaskStatus).map((status) => ({ label: status.replace('_', ' '), value: status }))]} value={searchParams.get('status') ?? ''} /><Select aria-label="Priority" onValueChange={(value) => setFilter('priority', value as string)} options={[{ label: 'All priorities', value: '' }, ...Object.values(TaskPriority).map((priority) => ({ label: priority, value: priority }))]} value={searchParams.get('priority') ?? ''} /><Select aria-label="Assignee" onValueChange={(value) => setFilter('assigneeId', value as string)} options={[{ label: 'All assignees', value: '' }, ...(currentUser ? [{ label: currentUser.name, value: currentUser.id }] : [])]} value={searchParams.get('assigneeId') ?? ''} /><Select aria-label="Label" onValueChange={(value) => setFilter('labelId', value as string)} options={[{ label: 'All labels', value: '' }, ...(labels?.map((label) => ({ label: label.name, value: label.id })) ?? [])]} value={searchParams.get('labelId') ?? ''} /></div>
}
