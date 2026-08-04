import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'

export function ProjectGridSkeleton() {
  return (
    <div aria-label="Loading projects" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">
      {Array.from({ length: 6 }, (_, index) => (
        <Card className="space-y-5 p-5" key={index}>
          <div className="flex justify-between"><Skeleton className="size-10 rounded-xl" /><Skeleton className="h-6 w-16" /></div>
          <div className="space-y-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2"><Skeleton className="h-10 flex-1" /><Skeleton className="h-10 w-10" /></div>
        </Card>
      ))}
    </div>
  )
}
