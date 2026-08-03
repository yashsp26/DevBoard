export type Profile = {
  avatar: string | null
  bio: string | null
  location: string | null
  website: string | null
  github: string | null
  linkedin: string | null
}

export type User = {
  id: string
  name: string
  email: string
  role: 'USER' | string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  profile: Profile
}

export interface MeResponse {
  success: boolean
  message: string
  data: User
}
