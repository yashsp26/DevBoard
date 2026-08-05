import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'

export function LabelSkeleton() {
  return <div className="grid gap-3 sm:grid-cols-2"><Card className="h-24 p-4"><Skeleton className="h-full w-full" /></Card><Card className="h-24 p-4"><Skeleton className="h-full w-full" /></Card></div>
}
