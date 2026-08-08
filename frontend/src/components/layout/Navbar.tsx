import { type ReactNode } from 'react'
import { GlobalSearch } from './GlobalSearch'

type NavbarProps = {
  actions?: ReactNode
  title?: string
}

export function Navbar({ actions, title }: NavbarProps) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-border bg-surface px-6">
      <p className="text-sm font-medium text-text">{title}</p>
      <div className="flex items-center gap-2">
        <GlobalSearch />
        {actions}
      </div>
    </header>
  )
}
