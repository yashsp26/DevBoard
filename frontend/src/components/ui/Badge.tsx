import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'

type BadgeProps = {
  'aria-label'?: string
  children: ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border border-border/70 bg-[var(--color-surface-secondary)] text-secondary',
  primary: 'border border-primary/30 bg-primary/15 text-primary',
  success: 'border border-success/30 bg-success/15 text-success',
  danger: 'border border-danger/30 bg-danger/15 text-danger',
  warning: 'border border-warning/30 bg-warning/15 text-warning',
  info: 'border border-info/30 bg-info/15 text-info',
}

export function Badge({ 'aria-label': ariaLabel, children, className, variant = 'default' }: BadgeProps) {
  return (
    <span aria-label={ariaLabel} className={cn('neu-raised-sm inline-flex min-w-0 max-w-full items-center overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
