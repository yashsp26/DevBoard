import { AuthLayout } from '../components/layout/AuthLayout'
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm'

export function ResetPasswordPage() {
  return (
    <AuthLayout description="Choose a strong new password to secure your account." title="Set a new password">
      <ResetPasswordForm />
    </AuthLayout>
  )
}
