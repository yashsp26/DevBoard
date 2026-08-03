import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound, Terminal, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useResetPassword } from '../../hooks/useAuth'
import { getApiErrorMessage } from '../../utils/apiError'
import { type ResetPasswordFormValues, resetPasswordSchema } from './authSchemas'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({ mode: 'onChange', resolver: zodResolver(resetPasswordSchema) })
  const { error, isPending, isSuccess, mutate } = useResetPassword()

  useEffect(() => {
    if (!isSuccess) return

    const redirectTimer = window.setTimeout(() => {
      navigate('/login', { replace: true, state: { passwordReset: true } })
    }, 1400)

    return () => window.clearTimeout(redirectTimer)
  }, [isSuccess, navigate])

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <TriangleAlert aria-hidden="true" className="size-7" />
        </span>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-text">Reset link is missing</h2>
          <p className="text-sm leading-6 text-muted">Request a new password reset link and open it from your email.</p>
        </div>
        <Link className="inline-flex text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary" to="/forgot-password">
          Request a new link
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center" role="status">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success">
          <CheckCircle2 aria-hidden="true" className="size-7" />
        </span>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-text">Password updated</h2>
          <p className="text-sm leading-6 text-muted">Your password is ready to use. Redirecting you to sign in…</p>
        </div>
      </div>
    )
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    mutate({ password: values.password, token })
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
            <p className="mt-1 text-xs leading-5 text-muted">Use a strong, unique password for your workspace.</p>
          </div>
        </div>
      </div>
      {error && (
        <div className="space-y-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger" role="alert">
          <div className="flex gap-3"><TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><p>{getApiErrorMessage(error, 'This reset link is invalid or has expired.')}</p></div>
          <Link className="ml-7 inline-flex font-medium underline" to="/forgot-password">Request a new link</Link>
        </div>
      )}
      <Input
        autoComplete="new-password"
        disabled={isPending}
        error={errors.password?.message}
        label="New password"
        type="password"
        {...register('password')}
      />
      <Input
        autoComplete="new-password"
        disabled={isPending}
        error={errors.confirmPassword?.message}
        label="Confirm new password"
        type="password"
        {...register('confirmPassword')}
      />
      <Button className="w-full" disabled={!isValid} isLoading={isPending} type="submit">Reset password</Button>
      <p className="text-center text-sm text-muted">
        <Link className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary" to="/login">Back to sign in</Link>
      </p>
    </form>
  )
}
