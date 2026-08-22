import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useState } from 'react'

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

  return (
    <DropdownMenu.Root modal={false} onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="neu-raised inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)] hover:text-text active:translate-y-0 active:shadow-[var(--shadow-inset)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
          type="button"
        >
          {triggerContent ?? label}
          <ChevronDown aria-hidden="true" className="size-4" />
        </button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              align={align === 'right' ? 'end' : 'start'}
              className="z-40 outline-none"
              forceMount
              side="bottom"
              sideOffset={8}
            >
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="neu-raised-lg min-w-44 rounded-2xl border border-border/70 bg-elevated p-1.5"
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                initial={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ duration: 0.12 }}
              >
                {items.map((item) => (
                  <DropdownMenu.Item
                    className="flex w-full rounded-xl px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-primary/12 hover:text-text focus-visible:outline-2 focus-visible:outline-primary data-[highlighted]:bg-primary/12 data-[highlighted]:text-text data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                    disabled={item.disabled}
                    key={item.label}
                    onSelect={item.onSelect}
                  >
                    {item.label}
                  </DropdownMenu.Item>
                ))}
                {footer && <div className="mt-1 border-t border-border p-1">{footer}</div>}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  )
}
