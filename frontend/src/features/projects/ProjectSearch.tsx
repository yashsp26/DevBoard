import { Search } from 'lucide-react'

type ProjectSearchProps = {
  onChange: (value: string) => void
  value: string
}

export function ProjectSearch({ onChange, value }: ProjectSearchProps) {
  return (
    <label className="relative block min-w-0 flex-1" htmlFor="project-search">
      <span className="sr-only">Search projects</span>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        className="min-h-10 w-full rounded-lg border border-border bg-app py-2 pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        id="project-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search projects..."
        type="search"
        value={value}
      />
    </label>
  )
}
