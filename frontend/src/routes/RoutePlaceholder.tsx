import { CircleAlert } from 'lucide-react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/ui/Button'

type RoutePlaceholderProps = {
  title: string
}

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </main>
  )
}

export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()
  const message = isRouteErrorResponse(error) ? error.statusText : 'An unexpected error occurred.'

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-xl">
        <EmptyState
          action={<Button onClick={() => navigate('/dashboard')}>Return to dashboard</Button>}
          description={message}
          icon={CircleAlert}
          title="Something went wrong"
        />
      </div>
    </main>
  )
}
