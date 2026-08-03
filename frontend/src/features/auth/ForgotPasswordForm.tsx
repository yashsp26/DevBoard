import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound, Terminal, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useForgotPassword } from '../../hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'
import { type ForgotPasswordFormValues, forgotPasswordSchema } from './authSchemas'

export function ForgotPasswordForm() {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  })
  const { error, isPending, isSuccess, mutate } = useForgotPassword()

  const onSubmit = (values: ForgotPasswordFormValues) => {
    mutate(values)
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 aria-hidden="true" className="size-7" />
        </span>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-text">Check your inbox</h2>
          <p className="text-sm leading-6 text-muted">
            If an account matches that email address, we&apos;ve sent a password reset link.
          </p>
        </div>
        <Link className="inline-flex text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary" to="/login">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-xl border border-border-subtle bg-app p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Terminal aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-text"><KeyRound aria-hidden="true" className="size-4" /> Secure recovery</p>
            <p className="mt-1 text-xs leading-5 text-muted">We&apos;ll send a one-time link to restore access.</p>
          </div>
        </div>
      </div>
      {error && (
        <div className="flex gap-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger" role="alert">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{getApiErrorMessage(error, 'Unable to send the reset link. Please try again.')}</p>
        </div>
      )}
      <Input
        autoComplete="email"
        disabled={isPending}
        error={errors.email?.message}
        label="Email address"
        type="email"
        {...register('email')}
      />
      <Button className="w-full" disabled={!isValid} isLoading={isPending} type="submit">
        Continue
      </Button>
      <p className="text-center text-sm text-muted">
        <Link className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary" to="/login">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}
