import { apiClient } from './client'
import type {
  Project,
  ProjectCreateRequest,
  ProjectListParams,
  ProjectListResponse,
  ProjectUpdateRequest,
} from '../types/project'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

export const projectApi = {
  async createProject(payload: ProjectCreateRequest) {
    const { data } = await apiClient.post<ApiResponse<Project>>('/v1/projects', payload)
    return data.data
  },

  async getProjects(params: ProjectListParams = {}) {
    const { data } = await apiClient.get<ApiResponse<ProjectListResponse>>('/v1/projects', {
      params: {
        ...params,
        favorite: params.favorite === undefined ? undefined : String(params.favorite),
      },
    })
    return data.data
  },

  async getProject(projectId: string) {
    const { data } = await apiClient.get<ApiResponse<Project>>(`/v1/projects/${projectId}`)
    return data.data
  },

  async updateProject({ projectId, payload }: { projectId: string; payload: ProjectUpdateRequest }) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(`/v1/projects/${projectId}`, payload)
    return data.data
  },

  async deleteProject(projectId: string) {
    await apiClient.delete(`/v1/projects/${projectId}`)
  },

  async toggleFavorite(projectId: string) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(`/v1/projects/${projectId}/favorite`)
    return data.data
  },

  async archiveProject(projectId: string) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(`/v1/projects/${projectId}/archive`)
    return data.data
  },

  async unarchiveProject(projectId: string) {
    const { data } = await apiClient.patch<ApiResponse<Project>>(`/v1/projects/${projectId}/unarchive`)
    return data.data
  },
}
