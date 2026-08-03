import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useChangePassword } from '../../services/useChangePassword'
import { type ChangePasswordFormValues, changePasswordSchema } from './profileSchemas'

type PasswordChangeSectionProps = {
  isLoading: boolean
}

export function PasswordChangeSection({ isLoading }: PasswordChangeSectionProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) })
  const { isPending, mutate } = useChangePassword()

  if (isLoading) {
    return (
      <Card className="space-y-5 p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-base font-semibold text-text">Change password</h2>
        <p className="text-sm text-muted">Use a unique password to keep your account secure.</p>
      </div>
      <form
        className="grid gap-5"
        noValidate
        onSubmit={handleSubmit((values) =>
          mutate(
            { currentPassword: values.currentPassword, newPassword: values.newPassword },
            { onSuccess: () => reset() },
          )
        )}
      >
        <Input autoComplete="current-password" error={errors.currentPassword?.message} label="Current password" type="password" {...register('currentPassword')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input autoComplete="new-password" error={errors.newPassword?.message} label="New password" type="password" {...register('newPassword')} />
          <Input autoComplete="new-password" error={errors.confirmPassword?.message} label="Confirm new password" type="password" {...register('confirmPassword')} />
        </div>
        <div>
          <Button isLoading={isPending} type="submit">Update password</Button>
        </div>
      </form>
    </Card>
  )
}
