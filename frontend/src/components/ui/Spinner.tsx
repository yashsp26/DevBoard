import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

type SpinnerProps = {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span aria-label={label} className="inline-flex" role="status">
      <LoaderCircle aria-hidden="true" className={cn('size-5 animate-spin', className)} />
    </span>
  )
}
