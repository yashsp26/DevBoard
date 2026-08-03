import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

type DropdownItem = {
  disabled?: boolean
  label: string
  onSelect: () => void
}

type DropdownProps = {
  align?: 'left' | 'right'
  footer?: ReactNode
  items: DropdownItem[]
  label: string
  triggerContent?: ReactNode
}

export function Dropdown({ align = 'right', footer, items, label, triggerContent }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
    }
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {triggerContent ?? label}
        <ChevronDown aria-hidden="true" className="size-4" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              'absolute z-40 mt-2 min-w-44 rounded-xl border border-border-subtle bg-elevated p-1 shadow-xl',
              align === 'right' ? 'right-0' : 'left-0',
            )}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            id={menuId}
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            ref={menuRef}
            role="menu"
            transition={{ duration: 0.12 }}
          >
            {items.map((item) => (
              <button
                className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={item.disabled}
                key={item.label}
                onClick={() => {
                  item.onSelect()
                  setIsOpen(false)
                }}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            ))}
            {footer && <div className="mt-1 border-t border-border p-1">{footer}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
