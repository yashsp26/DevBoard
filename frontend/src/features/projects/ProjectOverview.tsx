import { CalendarDays, Palette } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import type { Project } from '../../types/project'

export function ProjectOverview({ project }: { project: Project }) {
  const formatDate = (date: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
  return <Card className="p-6"><div className="flex items-start gap-4"><span aria-label="Project color" className="mt-1 size-11 shrink-0 rounded-xl border border-border-subtle" style={{ backgroundColor: project.color ?? 'var(--color-primary)' }} /><div className="min-w-0 space-y-4"><div><h2 className="text-lg font-semibold text-text">Overview</h2><p className="mt-2 text-sm leading-6 text-muted">{project.description || 'No description has been added to this project.'}</p></div><dl className="grid gap-3 border-t border-border pt-4 text-sm text-muted sm:grid-cols-2"><div className="flex items-center gap-2"><Palette aria-hidden="true" className="size-4" /><dt className="sr-only">Color</dt><dd>{project.color ?? 'Default'}</dd></div><div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4" /><dt className="sr-only">Created</dt><dd>Created {formatDate(project.createdAt)}</dd></div><div className="flex items-center gap-2 sm:col-span-2"><CalendarDays aria-hidden="true" className="size-4" /><dt className="sr-only">Updated</dt><dd>Updated {formatDate(project.updatedAt)}</dd></div></dl></div></div></Card>
}
