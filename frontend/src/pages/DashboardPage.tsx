import { LayoutDashboard } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'

export function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <PageHeader description="Your development workspace at a glance." title="Dashboard" />
      <Card className="p-6">
        <EmptyState
          description="Your dashboard is ready. Project and activity data will appear here when those backend resources are available."
          icon={LayoutDashboard}
          title="Nothing to show yet"
        />
      </Card>
    </main>
  )
}
