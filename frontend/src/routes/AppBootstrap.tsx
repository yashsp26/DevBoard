import { type ReactNode, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

type AppBootstrapProps = {
  children: ReactNode
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const initialize = useAuthStore((state) => state.initialize)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center bg-background" />
  }

  return children
}
