import { Box, FileText, FolderKanban, Tag } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import type { Project } from '../../types/project'

export function ProjectStats({ project }: { project: Project }) {
  const counts = project._count ?? { labels: 0, notes: 0, snippets: 0, tasks: 0 }
  const stats = [{ icon: FolderKanban, label: 'Tasks', value: counts.tasks }, { icon: Tag, label: 'Labels', value: counts.labels }, { icon: FileText, label: 'Notes', value: counts.notes }, { icon: Box, label: 'Snippets', value: counts.snippets }]
  return <section><h2 className="mb-3 text-base font-semibold text-text">Statistics</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ icon: Icon, label, value }) => <Card className="p-4" key={label}><Icon aria-hidden="true" className="size-4 text-primary" /><p className="mt-4 text-2xl font-semibold text-text">{value}</p><p className="text-sm text-muted">{label}</p></Card>)}</div></section>
}
