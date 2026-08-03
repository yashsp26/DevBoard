import { Navigate } from 'react-router'
import { useAuthStore } from '../store/authStore'

export function HomeRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return <Navigate replace to={isAuthenticated ? '/dashboard' : '/login'} />
}
