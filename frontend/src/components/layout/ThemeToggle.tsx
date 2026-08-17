import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

type ThemeToggleProps = {
  menuItem?: boolean
  showLabel?: boolean
}

export function ThemeToggle({ menuItem = false, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="neu-raised inline-flex size-10 items-center justify-center rounded-full border-0 text-muted-foreground transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)] hover:text-foreground active:translate-y-0 active:shadow-[var(--shadow-inset)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onClick={toggleTheme}
      role={menuItem ? 'menuitem' : undefined}
      type="button"
    >
      {theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      {showLabel && <span className="text-sm font-medium">Use {nextTheme} theme</span>}
    </button>
  )
}
