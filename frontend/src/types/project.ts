export type ProjectStatus = 'ACTIVE' | 'ARCHIVED'

export type ProjectSortField = 'name' | 'createdAt' | 'updatedAt'

export type SortOrder = 'asc' | 'desc'

export type ProjectCounts = {
  labels: number
  notes: number
  snippets: number
  tasks: number
}

export interface Project {
  id: string
  name: string
  description: string | null
  color: string | null
  isFavorite: boolean
  status: ProjectStatus
  ownerId: string
  createdAt: string
  updatedAt: string
  _count?: ProjectCounts
}

export interface ProjectPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ProjectListResponse {
  projects: Project[]
  pagination: ProjectPagination
}

export interface ProjectCreateRequest {
  name: string
  description?: string | null
  color?: string | null
}

export interface ProjectUpdateRequest {
  name?: string
  description?: string | null
  color?: string | null
}

export interface ProjectListParams {
  page?: number
  limit?: number
  search?: string
  status?: ProjectStatus
  favorite?: boolean
  sort?: ProjectSortField
  order?: SortOrder
}
