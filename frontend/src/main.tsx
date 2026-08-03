import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { queryClient } from './lib/queryClient'
import { AppBootstrap } from './routes/AppBootstrap'
import { router } from './routes/router'
import { ThemeProvider } from './context/ThemeContext'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppBootstrap>
          <RouterProvider router={router} />
        </AppBootstrap>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <Toaster richColors theme="system" />
    </QueryClientProvider>
  </StrictMode>,
)
