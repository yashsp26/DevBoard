import { isAxiosError } from 'axios'
import { AlertCircle } from 'lucide-react'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { ProfileContent } from '../features/profile/ProfileContent'
import { useProfile } from '../services/useProfile'

export function ProfilePage() {
  const { data: profile, error, isError, isLoading, refetch } = useProfile()
  const isMissing = isAxiosError(error) && error.response?.status === 404

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10 sm:px-8">
      <PageHeader description="Manage your personal details and account security." title="Profile" />
      {isError ? (
        <EmptyState
          action={<Button onClick={() => void refetch()}>Try again</Button>}
          description={isMissing ? 'This profile could not be found.' : 'We couldn’t load your profile details. Please try again.'}
          icon={AlertCircle}
          title={isMissing ? 'Profile not found' : 'Profile unavailable'}
        />
      ) : isLoading ? (
        <ProfileContent isLoading profile={undefined} />
      ) : (
        <ProfileContent isLoading={false} profile={profile} />
      )}
    </main>
  )
}
