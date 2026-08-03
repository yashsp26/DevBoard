import { AuthLayout } from '../components/layout/AuthLayout'
import { LoginForm } from '../features/auth/LoginForm'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!(location.state as { passwordReset?: boolean } | null)?.passwordReset) return

    toast.success('Password reset successfully. You can now sign in.')
    navigate('/login', { replace: true, state: null })
  }, [location.state, navigate])

  return (
    <AuthLayout description="Enter your details to continue to your workspace." title="Welcome back">
      <LoginForm />
    </AuthLayout>
  )
}
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
