import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'

export interface LoadingTasksProps {
  count?: number
  variant?: 'cards' | 'rows'
}

export function LoadingTasks({ count = 6, variant = 'cards' }: LoadingTasksProps) {
  if (variant === 'rows') return <div aria-label="Loading tasks" className="divide-y divide-border" role="status">{Array.from({ length: count }, (_, index) => <div className="grid min-h-24 gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]" key={index}><div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div><Skeleton className="h-7 w-32" /><Skeleton className="h-8 w-28" /></div>)}</div>
  return <div aria-label="Loading tasks" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">{Array.from({ length: count }, (_, index) => <Card className="min-h-56 space-y-4 p-5" key={index}><div className="flex justify-between"><Skeleton className="h-5 w-40" /><Skeleton className="h-6 w-16" /></div><Skeleton className="h-12 w-full" /><Skeleton className="h-6 w-32" /><div className="flex justify-between border-t border-border pt-4"><Skeleton className="h-4 w-24" /><Skeleton className="size-8 rounded-full" /></div></Card>)}</div>
}
