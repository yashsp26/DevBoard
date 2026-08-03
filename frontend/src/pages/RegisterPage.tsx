import { AuthLayout } from '../components/layout/AuthLayout'
import { RegisterForm } from '../features/auth/RegisterForm'

export function RegisterPage() {
  return (
    <AuthLayout description="Create an account to start organizing your development work." title="Create your account">
      <RegisterForm />
    </AuthLayout>
  )
}
