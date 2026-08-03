import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useRegister } from '../../services/useRegister'
import { getApiErrorMessage } from '../../utils/apiError'
import { type RegisterFormValues, registerSchema } from './authSchemas'

export function RegisterForm() {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })
  const { error, isPending, mutate } = useRegister()

  const onSubmit = (values: RegisterFormValues) => {
    mutate({
      email: values.email,
      name: values.name,
      password: values.password,
    })
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger" role="alert">
          {getApiErrorMessage(error, 'Unable to create your account. Please try again.')}
        </div>
      )}
      <Input autoComplete="name" error={errors.name?.message} label="Name" {...register('name')} />
      <Input autoComplete="email" error={errors.email?.message} label="Email address" type="email" {...register('email')} />
      <Input
        autoComplete="new-password"
        error={errors.password?.message}
        label="Password"
        type="password"
        {...register('password')}
      />
      <Input
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        label="Confirm password"
        type="password"
        {...register('confirmPassword')}
      />
      <Button className="w-full" isLoading={isPending} type="submit">
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  )
}
