import { Skeleton } from '../ui/Skeleton'
export function LoadingNotes() { return <div aria-label="Loading notes" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">{Array.from({ length: 6 }, (_, index) => <Skeleton className="h-56" key={index} />)}</div> }
