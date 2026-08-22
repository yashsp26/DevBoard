import { type ReactNode } from 'react'
import { GlobalSearch } from './GlobalSearch'

type NavbarProps = {
  actions?: ReactNode
  mobileNavigation?: ReactNode
  title?: string
}

export function Navbar({ actions, mobileNavigation, title }: NavbarProps) {
  return (
    <header className="neu-raised relative z-40 flex min-h-16 items-center justify-between gap-3 rounded-b-2xl border border-border/70 bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {mobileNavigation}
        <p className="truncate text-sm font-medium text-text">{title}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <GlobalSearch />
        {actions}
      </div>
    </header>
  )
}
