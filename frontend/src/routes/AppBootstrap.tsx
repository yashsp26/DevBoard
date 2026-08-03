import { type ReactNode, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

type AppBootstrapProps = {
  children: ReactNode
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    void initializeAuth()
  }, [initializeAuth])

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center bg-background" />
  }

  return children
}
