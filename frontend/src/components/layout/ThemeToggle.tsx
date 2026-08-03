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
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to Nord theme'}
      className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={toggleTheme}
      role={menuItem ? 'menuitem' : undefined}
      type="button"
    >
      {theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      {showLabel && <span className="text-sm font-medium">Use {nextTheme === 'dark' ? 'Nord' : 'light'} theme</span>}
    </button>
  )
}
