import { type ReactNode } from 'react'
import { GlobalSearch } from './GlobalSearch'

type NavbarProps = {
  actions?: ReactNode
  title?: string
}

export function Navbar({ actions, title }: NavbarProps) {
  return (
    <header className="neu-raised flex min-h-16 items-center justify-between rounded-b-2xl border border-border/70 bg-surface px-4 sm:px-6">
      <p className="text-sm font-medium text-text">{title}</p>
      <div className="flex items-center gap-2">
        <GlobalSearch />
        {actions}
      </div>
    </header>
  )
}
