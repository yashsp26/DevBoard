import { CalendarDays, Code2, Globe, Link2, Mail, MapPin, UserRound } from 'lucide-react'
import { UserAvatar } from '../../components/common/UserAvatar'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import type { Profile } from '../../types/profile'

type ProfileCardProps = {
  isLoading: boolean
  profile?: Profile
}

export function ProfileCard({ isLoading, profile }: ProfileCardProps) {
  if (isLoading || !profile) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <UserAvatar alt={`${profile.name}'s avatar`} fallbackSrc={profile.profile?.avatar} size="lg" />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-text">{profile.name}</h2>
              <Badge>{profile.role}</Badge>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted">{profile.profile?.bio || 'Add a bio'}</p>
          <dl className="grid gap-3 text-sm text-muted sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4" />
              <dt className="sr-only">Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-4" />
              <dt className="sr-only">Role</dt>
              <dd>{profile.role}</dd>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <CalendarDays aria-hidden="true" className="size-4" />
              <dt className="sr-only">Created date</dt>
              <dd>Member since {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(profile.createdAt))}</dd>
            </div>
          </dl>
          <dl className="grid gap-3 border-t border-border pt-4 text-sm text-muted sm:grid-cols-2">
            <div className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4" /><dt className="sr-only">Location</dt><dd>{profile.profile?.location || 'Add your location'}</dd></div>
            <div className="flex items-center gap-2"><Globe aria-hidden="true" className="size-4" /><dt className="sr-only">Website</dt><dd>{profile.profile?.website ? <a className="hover:text-primary hover:underline" href={profile.profile.website} rel="noreferrer" target="_blank">Website</a> : 'Add your website'}</dd></div>
            <div className="flex items-center gap-2"><Code2 aria-hidden="true" className="size-4" /><dt className="sr-only">GitHub</dt><dd>{profile.profile?.github ? <a className="hover:text-primary hover:underline" href={profile.profile.github} rel="noreferrer" target="_blank">GitHub</a> : 'Add your GitHub'}</dd></div>
            <div className="flex items-center gap-2"><Link2 aria-hidden="true" className="size-4" /><dt className="sr-only">LinkedIn</dt><dd>{profile.profile?.linkedin ? <a className="hover:text-primary hover:underline" href={profile.profile.linkedin} rel="noreferrer" target="_blank">LinkedIn</a> : 'Add your LinkedIn'}</dd></div>
          </dl>
        </div>
      </div>
    </Card>
  )
}
