import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { TaskFilters } from './TaskFilters'
import { TaskSearch } from './TaskSearch'

export function TaskToolbar({ onCreate, projectId }: { onCreate: () => void; projectId: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const setParam = (key: string, value: string) => setSearchParams((current) => { const next = new URLSearchParams(current); next.set(key, value); next.delete('page'); return next })
  return <section aria-label="Task controls" className="space-y-3"><div className="flex flex-col gap-3 sm:flex-row"><TaskSearch /><Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create Task</Button></div><div className="flex flex-wrap gap-3"><TaskFilters projectId={projectId} /><Select aria-label="Sort tasks" onValueChange={(value) => setParam('sort', value as string)} options={[{ label: 'Last updated', value: 'updatedAt' }, { label: 'Date created', value: 'createdAt' }, { label: 'Due date', value: 'dueDate' }, { label: 'Title', value: 'title' }]} value={searchParams.get('sort') ?? 'updatedAt'} /><Select aria-label="Sort order" onValueChange={(value) => setParam('order', value as string)} options={[{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }]} value={searchParams.get('order') ?? 'desc'} /></div></section>
}
