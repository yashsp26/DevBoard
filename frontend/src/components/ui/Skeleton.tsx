import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-border/70', className)} {...props} />
}
