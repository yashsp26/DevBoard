import type { TaskPriority, TaskStatus } from './task'

export type DashboardProject = {
  id: string
  name: string
  color: string | null
}

export type DashboardStatistics = {
  projects: number
  activeProjects: number
  archivedProjects: number
  favoriteProjects: number
  tasks: number
  completedTasks: number
  pendingTasks: number
  notes: number
  snippets: number
  labels: number
}

export type DashboardTasksByStatus = {
  status: TaskStatus
  _count: {
    _all: number
  }
}

export type DashboardTasksSummary = {
  todo: number
  inProgress: number
  review: number
  completed: number
  total: number
  byStatus: DashboardTasksByStatus[]
}

export type DashboardProjectsSummary = {
  total: number
  active: number
  archived: number
  favorites: number
}

export type UpcomingDashboardTask = {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  project: DashboardProject
}

export type DashboardActivityType = 'project' | 'task' | 'note' | 'snippet'

export type DashboardActivity = {
  id: string
  type: DashboardActivityType
  action: 'updated'
  title: string
  updatedAt: string
  project: DashboardProject | null
}

export type RecentDashboardNote = {
  id: string
  title: string
  projectId: string | null
  updatedAt: string
  project: DashboardProject | null
}

export type RecentDashboardSnippet = {
  id: string
  title: string
  language: string
  projectId: string | null
  updatedAt: string
  project: DashboardProject | null
}

export type DashboardData = {
  statistics: DashboardStatistics
  tasksSummary: DashboardTasksSummary
  projectsSummary: DashboardProjectsSummary
  upcomingTasks: UpcomingDashboardTask[]
  recentActivity: DashboardActivity[]
  recentNotes: RecentDashboardNote[]
  recentSnippets: RecentDashboardSnippet[]
}
