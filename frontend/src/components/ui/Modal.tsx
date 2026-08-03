import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { Button } from './Button'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const activeElement = document.activeElement as HTMLElement | null
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      activeElement?.focus()
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-scrim/60 p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
          role="dialog"
          transition={{ duration: 0.16 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg rounded-xl border border-border-subtle bg-elevated p-6 shadow-2xl"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            ref={dialogRef}
            tabIndex={-1}
            transition={{ duration: 0.16 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-text" id={titleId}>
                {title}
              </h2>
              <Button aria-label="Close dialog" className="size-9 min-h-0 p-0" onClick={onClose} variant="ghost">
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
