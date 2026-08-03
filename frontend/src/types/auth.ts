import type { User } from './user'

export type AuthUser = User

export type LoginResponse = {
  accessToken: string
  user: Pick<User, 'email' | 'id' | 'name' | 'role'>
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = {
  name: string
  email: string
  password: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type ForgotPasswordResponse = {
  success: boolean
  message: string
}

export type ResetPasswordRequest = {
  token: string
  password: string
}

export type AvatarUploadUrlResponse = {
  success: boolean
  data: {
    uploadUrl: string
    path: string
  }
}

export type SaveAvatarRequest = {
  path: string
}
