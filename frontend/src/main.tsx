import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'
import { AppBootstrap } from './routes/AppBootstrap'
import { router } from './routes/router'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './style.css'

function AppToaster() {
  const { theme } = useTheme()
  return <Toaster richColors theme={theme} toastOptions={{ className: 'app-toast' }} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppBootstrap>
          <RouterProvider router={router} />
        </AppBootstrap>
        <AppToaster />
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
