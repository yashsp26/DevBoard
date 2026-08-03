import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

type EmptyStateProps = {
  action?: ReactNode
  description: string
  icon: LucideIcon
  title: string
}

export function EmptyState({ action, description, icon: Icon, title }: EmptyStateProps) {
  return (
    <section className="grid place-items-center rounded-xl border border-dashed border-border-subtle bg-elevated px-6 py-16 text-center">
      <div className="max-w-sm space-y-3">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-app text-muted">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h2 className="text-base font-semibold text-text">{title}</h2>
        <p className="text-sm leading-6 text-muted">{description}</p>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </section>
  )
}
