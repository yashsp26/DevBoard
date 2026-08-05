import { Dialog } from '../../components/ui/Dialog'
import type { Label } from '../../types/label'

type DeleteLabelDialogProps = {
  isDeleting: boolean
  isOpen: boolean
  label?: Label
  onClose: () => void
  onConfirm: () => void
}

export function DeleteLabelDialog({ isDeleting, isOpen, label, onClose, onConfirm }: DeleteLabelDialogProps) {
  if (!label) return null

  return (
    <Dialog
      confirmLabel="Delete label"
      isLoading={isDeleting}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Label?"
      variant="danger"
    >
      Are you sure you want to delete <strong className="font-semibold text-text">{label.name}</strong>? Tasks using this label will simply lose the label association.
    </Dialog>
  )
}
