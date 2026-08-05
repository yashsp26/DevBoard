import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Button } from '../ui/Button'
import { TaskFilters } from './TaskFilters'
import { TaskSearch } from './TaskSearch'

export function TaskToolbar({ onCreate, projectId }: { onCreate: () => void; projectId: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const setParam = (key: string, value: string) => setSearchParams((current) => { const next = new URLSearchParams(current); next.set(key, value); next.delete('page'); return next })
  return <section aria-label="Task controls" className="space-y-3"><div className="flex flex-col gap-3 sm:flex-row"><TaskSearch /><Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create Task</Button></div><div className="flex flex-wrap gap-3"><TaskFilters projectId={projectId} /><label className="sr-only" htmlFor="task-sort">Sort tasks</label><select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" id="task-sort" onChange={(event) => setParam('sort', event.target.value)} value={searchParams.get('sort') ?? 'updatedAt'}><option value="updatedAt">Last updated</option><option value="createdAt">Date created</option><option value="dueDate">Due date</option><option value="title">Title</option></select><label className="sr-only" htmlFor="task-order">Sort order</label><select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" id="task-order" onChange={(event) => setParam('order', event.target.value)} value={searchParams.get('order') ?? 'desc'}><option value="desc">Descending</option><option value="asc">Ascending</option></select></div></section>
}
