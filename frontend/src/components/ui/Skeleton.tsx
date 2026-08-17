import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-xl bg-[var(--color-surface-secondary)] shadow-inner', className)} {...props} />
}
