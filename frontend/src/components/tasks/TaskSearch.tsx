import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

export function TaskSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const [value, setValue] = useState(search)
  const debouncedValue = useDebouncedValue(value)
  useEffect(() => setValue(search), [search])
  useEffect(() => { if (debouncedValue !== search) setSearchParams((current) => { const next = new URLSearchParams(current); if (debouncedValue) next.set('search', debouncedValue); else next.delete('search'); next.delete('page'); return next }) }, [debouncedValue, search, setSearchParams])
  return <label className="relative block min-w-0 flex-1" htmlFor="task-search"><span className="sr-only">Search tasks</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input className="min-h-10 w-full rounded-lg border border-border bg-app py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" id="task-search" onChange={(event) => setValue(event.target.value)} placeholder="Search tasks..." type="search" value={value} /></label>
}
