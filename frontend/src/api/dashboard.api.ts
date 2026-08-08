import { apiClient } from './client'
import type { DashboardData } from '../types/dashboard'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

export const dashboardApi = {
  async getDashboard() {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>('/v1/dashboard')
    return data.data
  },
}
