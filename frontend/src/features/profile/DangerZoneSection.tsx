import { AlertTriangle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Dialog } from '../../components/ui/Dialog'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { useState } from 'react'
import { useDeleteAccount } from '../../services/useDeleteAccount'

type DangerZoneSectionProps = {
  isLoading: boolean
}

export function DangerZoneSection({ isLoading }: DangerZoneSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const { isPending, mutate } = useDeleteAccount()

  if (isLoading) {
    return (
      <Card className="space-y-5 p-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-10 w-36" />
      </Card>
    )
  }

  return (
    <Card className="border-danger/40 p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <AlertTriangle aria-hidden="true" className="size-5" />
          </span>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-text">Danger zone</h2>
            <p className="max-w-xl text-sm leading-6 text-muted">Permanently delete your account and all of its associated data. This action cannot be undone.</p>
          </div>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} variant="danger">Delete account</Button>
      </div>
      <Dialog
        confirmLabel="Delete account"
        isConfirmDisabled={confirmation !== 'DELETE'}
        isLoading={isPending}
        isOpen={isDialogOpen}
        onClose={() => {
          setConfirmation('')
          setIsDialogOpen(false)
        }}
        onConfirm={() => mutate()}
        title="Delete your account?"
        variant="danger"
      >
        <p>This permanently removes your account and associated data. Type <strong className="font-semibold text-text">DELETE</strong> to continue.</p>
        <div className="mt-4">
          <Input
            autoComplete="off"
            label="Confirmation"
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="DELETE"
            value={confirmation}
          />
        </div>
      </Dialog>
    </Card>
  )
}
