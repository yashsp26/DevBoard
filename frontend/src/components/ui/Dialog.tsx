import { type ReactNode } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'

type DialogProps = {
  cancelLabel?: string
  children: ReactNode
  confirmLabel: string
  isConfirmDisabled?: boolean
  isLoading?: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  variant?: 'primary' | 'danger'
}

export function Dialog({
  cancelLabel = 'Cancel',
  children,
  confirmLabel,
  isConfirmDisabled = false,
  isLoading = false,
  isOpen,
  onClose,
  onConfirm,
  title,
  variant = 'primary',
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-sm leading-6 text-muted">{children}</div>
        <div className="flex justify-end gap-3">
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>
          <Button disabled={isConfirmDisabled} isLoading={isLoading} onClick={onConfirm} variant={variant}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
