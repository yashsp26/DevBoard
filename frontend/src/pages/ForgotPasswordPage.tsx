import { AuthLayout } from '../components/layout/AuthLayout'
import { ForgotPasswordForm } from '../features/auth/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <AuthLayout description="Enter your email and we’ll help you get back into your account." title="Reset your password">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
