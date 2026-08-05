import { apiClient } from './client'
import type { CreateLabelRequest, Label, UpdateLabelRequest } from '../types/label'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

export const labelApi = {
  async getLabels(projectId: string) {
    const { data } = await apiClient.get<ApiResponse<Label[]>>(`/v1/projects/${projectId}/labels`)
    return data.data
  },

  async createLabel(projectId: string, payload: CreateLabelRequest) {
    const { data } = await apiClient.post<ApiResponse<Label>>(`/v1/projects/${projectId}/labels`, payload)
    return data.data
  },

  async updateLabel(labelId: string, payload: UpdateLabelRequest) {
    const { data } = await apiClient.patch<ApiResponse<Label>>(`/v1/labels/${labelId}`, payload)
    return data.data
  },

  async deleteLabel(labelId: string) {
    await apiClient.delete(`/v1/labels/${labelId}`)
  },
}
