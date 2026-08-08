import { apiClient } from './client'
import type { SearchResponse, SearchType } from '../types/search'

type ApiResponse<TData> = {
  data: TData
  message: string
  success: boolean
}

export const searchApi = {
  async search(query: string, type: SearchType = 'all', signal?: AbortSignal) {
    const { data } = await apiClient.get<ApiResponse<SearchResponse>>('/v1/search', { params: { q: query, type }, signal })
    return data.data
  },
}
