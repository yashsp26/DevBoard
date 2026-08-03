import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../store/authStore'

type ProtectedRouteProps = {
  access?: 'protected' | 'guest'
}

export function ProtectedRoute({ access = 'protected' }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (access === 'protected' && !isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  if (access === 'guest' && isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  return <Outlet />
}
