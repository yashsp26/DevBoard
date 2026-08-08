import { AlertCircle, CalendarDays, Code2, FileText, FolderKanban, Heart, ListTodo, Plus, Tags, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { TaskPriorityBadge } from '../components/tasks/TaskPriorityBadge'
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { useDashboard } from '../services/useDashboard'
import type { DashboardActivity } from '../types/dashboard'
import { TaskStatus } from '../types/task'

type StatisticCardProps = {
  description: string
  icon: LucideIcon
  label: string
  value: number
}

function StatisticCard({ description, icon: Icon, label, value }: StatisticCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text">{value}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
    </Card>
  )
}

function getActivityMeta(type: DashboardActivity['type']) {
  return {
    project: { icon: FolderKanban, label: 'Project' },
    task: { icon: ListTodo, label: 'Task' },
    note: { icon: FileText, label: 'Note' },
    snippet: { icon: Code2, label: 'Snippet' },
  }[type]
}

function formatRelativeTime(value: string) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  const [amount, unit] = elapsedSeconds < 60 ? [elapsedSeconds, 'second'] : elapsedSeconds < 3600 ? [Math.floor(elapsedSeconds / 60), 'minute'] : elapsedSeconds < 86400 ? [Math.floor(elapsedSeconds / 3600), 'hour'] : [Math.floor(elapsedSeconds / 86400), 'day']
  return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(-amount, `${unit}s` as Intl.RelativeTimeFormatUnit)
}

function CompactEmpty({ title }: { title: string }) {
  return <div className="px-5 py-6 text-sm text-muted">{title}</div>
}

export function DashboardPage() {
  const { data, isError, isLoading, refetch } = useDashboard()
  const navigate = useNavigate()

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <PageHeader
        description="Your development workspace at a glance."
        title="Dashboard"
      />
      <section aria-labelledby="quick-actions-heading">
        <Card className="p-5">
          <div className="mb-4"><h2 className="font-semibold text-text" id="quick-actions-heading">Quick Actions</h2><p className="mt-1 text-sm text-muted">Start your next piece of work.</p></div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <Button className="justify-start" onClick={() => navigate('/projects?modal=create')}><Plus aria-hidden="true" className="size-4" />New Project</Button>
            <Button className="justify-start" onClick={() => navigate('/projects')} variant="secondary"><Plus aria-hidden="true" className="size-4" />New Task</Button>
            <Button className="justify-start" onClick={() => navigate('/notes?modal=create')} variant="secondary"><Plus aria-hidden="true" className="size-4" />New Note</Button>
            <Button className="justify-start" onClick={() => navigate('/snippets?modal=create')} variant="secondary"><Plus aria-hidden="true" className="size-4" />New Snippet</Button>
          </div>
        </Card>
      </section>
      {isLoading ? (
        <div aria-busy="true" aria-label="Loading dashboard" className="space-y-8">
          <section aria-label="Loading dashboard statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => (
              <Card className="space-y-4 p-5" key={index}>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-14" />
                <Skeleton className="h-4 w-24" />
              </Card>
            ))}
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => <Card className="space-y-5 p-5" key={index}><Skeleton className="h-6 w-36" /><div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div></Card>)}
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => <div key={index}><Skeleton className="mb-4 h-6 w-40" /><Card className="space-y-4 p-5"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></Card></div>)}
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => <div key={index}><Skeleton className="mb-4 h-6 w-32" /><Card className="space-y-4 p-5"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></Card></div>)}
          </section>
        </div>
      ) : isError ? (
        <EmptyState
          action={<Button onClick={() => void refetch()}>Try again</Button>}
          description="We couldn’t load your dashboard. Please try again."
          icon={AlertCircle}
          title="Dashboard unavailable"
        />
      ) : data ? (
        <>
          <section aria-label="Workspace overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatisticCard description={`${data.statistics.activeProjects} active`} icon={FolderKanban} label="Projects" value={data.statistics.projects} />
          <StatisticCard description={`${data.statistics.completedTasks} completed`} icon={ListTodo} label="Tasks" value={data.statistics.tasks} />
          <StatisticCard description="Personal and project notes" icon={FileText} label="Notes" value={data.statistics.notes} />
          <StatisticCard description="Reusable code snippets" icon={Code2} label="Snippets" value={data.statistics.snippets} />
          <StatisticCard description="Across all projects" icon={Tags} label="Labels" value={data.statistics.labels} />
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-text">Tasks summary</h2>
                <p className="mt-1 text-sm text-muted">{data.tasksSummary.total} tasks across your workspace</p>
              </div>
              <ListTodo aria-hidden="true" className="size-5 text-primary" />
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [TaskStatus.TODO, data.tasksSummary.todo],
                [TaskStatus.IN_PROGRESS, data.tasksSummary.inProgress],
                [TaskStatus.REVIEW, data.tasksSummary.review],
                [TaskStatus.DONE, data.tasksSummary.completed],
              ].map(([status, count]) => (
                <div className="flex items-center justify-between rounded-lg bg-app px-3 py-2.5" key={status}>
                  <dt><TaskStatusBadge status={status as TaskStatus} /></dt>
                  <dd className="text-lg font-semibold text-text">{count}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-text">Projects summary</h2>
                <p className="mt-1 text-sm text-muted">A quick view of your project workspace</p>
              </div>
              <Button onClick={() => navigate('/projects')} variant="secondary">View projects</Button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-app p-3"><dt className="text-muted">Total</dt><dd className="mt-1 text-xl font-semibold text-text">{data.projectsSummary.total}</dd></div>
              <div className="rounded-lg bg-app p-3"><dt><Badge variant="success">Active</Badge></dt><dd className="mt-1 text-xl font-semibold text-text">{data.projectsSummary.active}</dd></div>
              <div className="rounded-lg bg-app p-3"><dt><Badge variant="warning">Archived</Badge></dt><dd className="mt-1 text-xl font-semibold text-text">{data.projectsSummary.archived}</dd></div>
              <div className="rounded-lg bg-app p-3"><dt className="flex items-center gap-1.5 text-primary"><Heart aria-hidden="true" className="size-4 fill-primary" />Favorites</dt><dd className="mt-1 text-xl font-semibold text-text">{data.projectsSummary.favorites}</dd></div>
            </dl>
          </Card>
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <section aria-labelledby="upcoming-tasks-heading">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text" id="upcoming-tasks-heading">Upcoming tasks</h2>
            <p className="mt-1 text-sm text-muted">Tasks with the nearest due dates.</p>
          </div>
          {data.upcomingTasks.length ? (
            <Card className="divide-y divide-border">
              {data.upcomingTasks.map((task) => (
                <button className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-app focus-visible:outline-2 focus-visible:outline-primary sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" key={task.id} onClick={() => navigate(`/projects/${task.project.id}/tasks?task=${task.id}`)} type="button">
                  <span className="min-w-0"><span className="flex items-center gap-2"><span aria-label={`${task.project.name} project color`} className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: task.project.color ?? 'var(--color-primary)' }} /><span className="truncate font-medium text-text">{task.title}</span></span><span className="mt-1 block truncate text-sm text-muted">{task.project.name}</span></span>
                  <span className="flex flex-wrap items-center gap-2"><TaskPriorityBadge priority={task.priority} /><TaskStatusBadge status={task.status} /></span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted"><CalendarDays aria-hidden="true" className="size-4" />Due {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(task.dueDate))}</span>
                </button>
              ))}
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-app text-muted"><CalendarDays aria-hidden="true" className="size-5" /></span>
                <div><h3 className="font-medium text-text">No upcoming tasks</h3><p className="mt-1 text-sm text-muted">You're all caught up.</p></div>
              </div>
            </Card>
          )}
          </section>
          <section aria-labelledby="recently-updated-heading">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text" id="recently-updated-heading">Recently Updated</h2>
            <p className="mt-1 text-sm text-muted">Your latest changes across DevBoard.</p>
          </div>
          <Card className="divide-y divide-border">
            {data.recentActivity.length ? data.recentActivity.map((activity) => {
              const { icon: Icon, label } = getActivityMeta(activity.type)
              return <article className="flex min-w-0 items-center gap-3 px-5 py-3.5" key={activity.id}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app text-primary"><Icon aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium text-text">{activity.title}</h3><p className="mt-0.5 text-xs text-muted">{label} · Updated {formatRelativeTime(activity.updatedAt)}</p></div>
                {activity.project && <span className="max-w-36 truncate text-xs text-muted">{activity.project.name}</span>}
              </article>
            }) : <CompactEmpty title="No recent activity." />}
          </Card>
          </section>
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <div className="mb-4"><h2 className="text-lg font-semibold text-text">Recent Notes</h2><p className="mt-1 text-sm text-muted">Your latest notes.</p></div>
            <Card className="divide-y divide-border">
              {data.recentNotes.length ? data.recentNotes.map((note) => <button className="flex w-full min-w-0 items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-app focus-visible:outline-2 focus-visible:outline-primary" key={note.id} onClick={() => navigate('/notes')} type="button"><FileText aria-hidden="true" className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-text">{note.title}</span><span className="mt-0.5 block truncate text-xs text-muted">{note.project?.name ?? 'Personal note'} · Updated {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt))}</span></span></button>) : <CompactEmpty title="No recent notes" />}
            </Card>
          </div>
          <div>
            <div className="mb-4"><h2 className="text-lg font-semibold text-text">Recent Snippets</h2><p className="mt-1 text-sm text-muted">Your latest reusable code.</p></div>
            <Card className="divide-y divide-border">
              {data.recentSnippets.length ? data.recentSnippets.map((snippet) => <button className="flex w-full min-w-0 items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-app focus-visible:outline-2 focus-visible:outline-primary" key={snippet.id} onClick={() => navigate('/snippets')} type="button"><Code2 aria-hidden="true" className="size-4 shrink-0 text-primary" /><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="truncate text-sm font-medium text-text">{snippet.title}</span><Badge variant="primary">{snippet.language}</Badge></span><span className="mt-0.5 block truncate text-xs text-muted">{snippet.project?.name ?? 'Personal snippet'} · Updated {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(snippet.updatedAt))}</span></span></button>) : <CompactEmpty title="No recent snippets" />}
            </Card>
          </div>
        </section>
        </>
      ) : (
        <Card className="p-6">
          <EmptyState description="No dashboard data is available yet." icon={FolderKanban} title="Nothing to show yet" />
        </Card>
      )}
    </main>
  )
}
