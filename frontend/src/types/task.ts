import type { Label } from './label'
import type { User } from './user'

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export interface Task {
  id: string
  projectId: string
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  assigneeId: string
  assignee: Pick<User, 'email' | 'id' | 'name'> | null
  labelIds: string[]
  labels: Array<Pick<Label, 'color' | 'id' | 'name'>>
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string | null
  assigneeId?: string
  labelIds?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string | null
  assigneeId?: string
  labelIds?: string[]
}

export interface TaskFilters {
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  labelId?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface Paginated<T> {
  tasks: T[]
  pagination: Pagination
}
