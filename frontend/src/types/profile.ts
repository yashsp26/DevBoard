import type { Profile as UserProfile, User } from './user'

/** @deprecated Import `User` or `Profile` from `types/user` in new code. */
export type Profile = User
export type { UserProfile }

export type UpdateProfilePayload = Partial<
  Pick<Profile, 'name'> & Pick<UserProfile, 'bio' | 'github' | 'linkedin' | 'location' | 'website'>
>

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}
