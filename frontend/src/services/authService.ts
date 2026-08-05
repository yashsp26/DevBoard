import { apiClient } from '../api/client'
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  ResetPasswordRequest,
} from '../types/auth'
import type { MeResponse } from '../types/user'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/v1/auth/login', credentials)
    return data.data
  },

  async register(credentials: RegisterCredentials) {
    await apiClient.post('/v1/auth/register', credentials)
  },

  async logout() {
    await apiClient.post('/v1/auth/logout')
  },

  async refresh() {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>('/v1/auth/refresh')
    return data.data.accessToken
  },

  async me() {
    const { data } = await apiClient.get<MeResponse>('/v1/auth/me')
    return data.data
  },

  async forgotPassword(request: ForgotPasswordRequest) {
    const { data } = await apiClient.post<ForgotPasswordResponse>('/v1/auth/forgot-password', request)
    return data
  },

  async resetPassword(request: ResetPasswordRequest) {
    const { data } = await apiClient.post<ForgotPasswordResponse>('/v1/auth/reset-password', request)
    return data
  },
}
