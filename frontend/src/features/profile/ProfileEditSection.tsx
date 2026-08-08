import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import { Textarea } from '../../components/ui/Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateProfile } from '../../services/useUpdateProfile'
import type { Profile } from '../../types/profile'
import { AvatarUploader } from '../avatar/AvatarUploader'
import { type UpdateProfileFormValues, updateProfileSchema } from './profileSchemas'

type ProfileEditSectionProps = {
  isLoading: boolean
  profile?: Profile
}

export function ProfileEditSection({ isLoading, profile }: ProfileEditSectionProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<UpdateProfileFormValues>({ resolver: zodResolver(updateProfileSchema) })
  const { isPending, mutate } = useUpdateProfile()

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.profile?.bio ?? '',
        github: profile.profile?.github ?? '',
        linkedin: profile.profile?.linkedin ?? '',
        location: profile.profile?.location ?? '',
        website: profile.profile?.website ?? '',
      })
    }
  }, [profile, reset])

  if (isLoading || !profile) {
    return (
      <Card className="space-y-5 p-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-10 w-32" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6 space-y-1">
        <h2 className="text-base font-semibold text-text">Profile details</h2>
        <p className="text-sm text-muted">Update the information people see on your profile.</p>
      </div>
      <div className="mb-6">
        <AvatarUploader fallbackSrc={profile.profile?.avatar} name={profile.name} />
      </div>
      <form className="grid gap-5" noValidate onSubmit={handleSubmit((values) => mutate(values))}>
        <Input defaultValue={profile.email} disabled label="Email" type="email" className="opacity-60"/>
        <Textarea error={errors.bio?.message} label="Bio" {...register('bio')} />
        <Input error={errors.location?.message} label="Location" {...register('location')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input error={errors.website?.message} label="Website" type="url" {...register('website')} />
          <Input error={errors.github?.message} label="GitHub" type="url" {...register('github')} />
        </div>
        <Input error={errors.linkedin?.message} label="LinkedIn" type="url" {...register('linkedin')} />
        <div>
          <Button isLoading={isPending} type="submit">Save changes</Button>
        </div>
      </form>
    </Card>
  )
}
