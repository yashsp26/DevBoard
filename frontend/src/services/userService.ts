import { apiClient } from '../api/client'
import type { AvatarUploadUrlResponse, SaveAvatarRequest } from '../types/auth'
import type { ChangePasswordPayload, Profile, UpdateProfilePayload } from '../types/profile'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

type AvatarResponse = {
  avatarUrl: string | null
}

export const userService = {
  async getProfile() {
    const { data } = await apiClient.get<ApiResponse<Profile>>('/v1/user/profile')
    return data.data
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await apiClient.patch<ApiResponse<Profile>>('/v1/user/profile', payload)
    return data.data
  },

  async changePassword(payload: ChangePasswordPayload) {
    await apiClient.patch<ApiResponse<null>>('/v1/user/change-password', payload)
  },

  async deleteProfile() {
    await apiClient.delete('/v1/user/profile')
  },

  async getAvatarUploadUrl(fileName: string) {
    const { data } = await apiClient.post<AvatarUploadUrlResponse>('/v1/user/avatar/upload-url', { fileName })
    return data.data
  },

  async saveAvatar(path: SaveAvatarRequest['path']) {
    const { data } = await apiClient.patch<ApiResponse<{ avatar: string }>>('/v1/user/avatar', { path })
    return data.data
  },

  async getAvatar() {
    const { data } = await apiClient.get<ApiResponse<AvatarResponse>>('/v1/user/avatar')
    return data.data.avatarUrl
  },

  async deleteAvatar() {
    await apiClient.delete('/v1/user/avatar')
  },
}
