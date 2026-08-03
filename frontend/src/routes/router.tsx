import { createBrowserRouter } from 'react-router'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { ForbiddenPage, NetworkErrorPage, NotFoundPage } from '../pages/StatusPages'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { HomeRedirect } from './HomeRedirect'
import { ProtectedRoute } from './ProtectedRoute'
import { RouteErrorBoundary } from './RoutePlaceholder'

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomeRedirect /> },
      {
        element: <ProtectedRoute access="guest" />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/network-error', element: <NetworkErrorPage /> },
      { path: '/forbidden', element: <ForbiddenPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/profile', element: <ProfilePage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
