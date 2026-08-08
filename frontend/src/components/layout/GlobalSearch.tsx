import { Code2, FileText, FolderKanban, ListTodo, Search, Tag, X, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useSearch } from '../../services/useSearch'
import type { SearchResult, SearchType } from '../../types/search'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/Spinner'

const groups: Array<{ key: SearchResult['type']; label: string; icon: LucideIcon }> = [
  { key: 'project', label: 'Projects', icon: FolderKanban },
  { key: 'task', label: 'Tasks', icon: ListTodo },
  { key: 'note', label: 'Notes', icon: FileText },
  { key: 'snippet', label: 'Snippets', icon: Code2 },
  { key: 'label', label: 'Labels', icon: Tag },
]

const filterOptions: Array<{ label: string; value: SearchType }> = [
  { label: 'All', value: 'all' },
  { label: 'Projects', value: 'projects' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Notes', value: 'notes' },
  { label: 'Snippets', value: 'snippets' },
  { label: 'Labels', value: 'labels' },
]

function getResultTitle(result: SearchResult) {
  return result.type === 'project' || result.type === 'label' ? result.name : result.title
}

function getProject(result: SearchResult) {
  return result.type === 'project' ? { color: result.color, name: result.name } : result.project
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<SearchType>('all')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebouncedValue(trimmedQuery)
  const { data, isError, isFetching } = useSearch(debouncedQuery, type)
  const navigate = useNavigate()
  const canSearch = trimmedQuery.length >= 2 && debouncedQuery.length >= 2
  const showResults = isOpen && canSearch
  const flatResults = groups.flatMap(({ key }) => data?.results.filter((result) => result.type === key) ?? [])

  useEffect(() => {
    setHighlightedIndex(flatResults.length ? 0 : -1)
  }, [debouncedQuery, type, flatResults.length])

  useEffect(() => {
    if (isError) toast.error('Search is unavailable. Please try again.')
  }, [isError])

  const close = () => {
    setIsOpen(false)
    setIsMobileOpen(false)
    setHighlightedIndex(-1)
  }

  const openResult = (result: SearchResult) => {
    if (result.type === 'project') navigate(`/projects/${result.id}`)
    else if (result.type === 'task') navigate(`/projects/${result.project.id}/tasks?task=${result.id}`)
    else if (result.type === 'label') navigate(`/projects/${result.project.id}`)
    else if (result.type === 'note') navigate('/notes')
    else navigate('/snippets')
    setQuery('')
    close()
  }

  const searchField = (mobile = false) => <div className="relative" role="search">
    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
    <input
      aria-label="Search DevBoard"
      className="min-h-10 w-full rounded-lg border border-border bg-app py-2 pl-9 pr-9 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
      onChange={(event) => setQuery(event.target.value)}
      onFocus={() => setIsOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
        if (!flatResults.length) return
        if (event.key === 'ArrowDown') { event.preventDefault(); setHighlightedIndex((index) => (index + 1) % flatResults.length) }
        if (event.key === 'ArrowUp') { event.preventDefault(); setHighlightedIndex((index) => (index - 1 + flatResults.length) % flatResults.length) }
        if (event.key === 'Enter' && highlightedIndex >= 0) { event.preventDefault(); openResult(flatResults[highlightedIndex]) }
      }}
      placeholder="Search DevBoard..."
      type="search"
      value={query}
    />
    {query && <Button aria-label="Clear search" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setQuery('')} size="icon" variant="ghost"><X aria-hidden="true" className="size-4" /></Button>}
    {showResults && <div className={`absolute z-50 mt-2 overflow-hidden rounded-xl border border-border bg-elevated shadow-xl ${mobile ? 'right-0 w-[min(22rem,calc(100vw-2rem))]' : 'left-0 w-96'}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <span className="sr-only">Filter search results</span>
        <select aria-label="Filter search results" className="min-h-8 rounded-md border border-border bg-app px-2 text-xs text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" onChange={(event) => setType(event.target.value as SearchType)} value={type}>
          {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {type === 'all' && data && <div className="flex flex-wrap justify-end gap-x-2 text-xs text-muted"><span>Projects {data.counts.projects}</span><span>Tasks {data.counts.tasks}</span><span>Notes {data.counts.notes}</span><span>Snippets {data.counts.snippets}</span><span>Labels {data.counts.labels}</span></div>}
      </div>
      {isFetching ? <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted"><Spinner className="size-4" label="Searching" />Searching…</div> : isError ? <p className="px-4 py-3 text-sm text-muted">Search is unavailable. Please try again.</p> : data?.results.length ? <div className="max-h-[min(70vh,32rem)] overflow-y-auto py-2">{groups.map(({ icon: Icon, key, label }) => {
        const results = data.results.filter((result) => result.type === key)
        return results.length ? <section key={key}><h2 className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">{label}</h2>{results.map((result) => {
          const project = getProject(result)
          const resultIndex = flatResults.indexOf(result)
          return <button aria-selected={highlightedIndex === resultIndex} className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary ${highlightedIndex === resultIndex ? 'bg-app' : 'hover:bg-app'}`} key={result.id} onMouseDown={(event) => event.preventDefault()} onClick={() => openResult(result)} type="button"><Icon aria-hidden="true" className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="truncate text-sm font-medium text-text">{getResultTitle(result)}</span>{result.type === 'snippet' && <Badge variant="primary">{result.language}</Badge>}</span><span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted"><span className="capitalize">{result.type}</span>{project && <><span>·</span><span aria-label={`${project.name} project color`} className="size-2 shrink-0 rounded-full" style={{ backgroundColor: project.color ?? 'var(--color-primary)' }} /><span className="truncate">{project.name}</span></>}</span></span></button>
        })}</section> : null
      })}</div> : <div className="px-4 py-4 text-sm text-muted"><p className="font-medium text-text">No results found</p><p className="mt-1">Try a different search term.</p></div>}
    </div>}
  </div>

  return <div className="relative"><div className="hidden w-72 md:block">{searchField()}</div><div className="md:hidden"><Button aria-label="Search DevBoard" onClick={() => { const next = !isMobileOpen; setIsMobileOpen(next); setIsOpen(next) }} size="icon" variant="ghost"><Search aria-hidden="true" className="size-4" /></Button>{isMobileOpen && <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))]">{searchField(true)}</div>}</div></div>
}
