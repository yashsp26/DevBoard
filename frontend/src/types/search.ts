import type { ProjectStatus } from './project'
import type { TaskPriority, TaskStatus } from './task'

export type SearchType = 'all' | 'projects' | 'tasks' | 'notes' | 'snippets' | 'labels'

export type SearchProjectReference = {
  id: string
  name: string
  color: string | null
}

export type SearchProjectResult = {
  type: 'project'
  id: string
  name: string
  description: string | null
  color: string | null
  status: ProjectStatus
  updatedAt: string
}

export type SearchTaskResult = {
  type: 'task'
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  updatedAt: string
  project: SearchProjectReference
}

export type SearchNoteResult = {
  type: 'note'
  id: string
  title: string
  content: string
  updatedAt: string
  project: SearchProjectReference | null
}

export type SearchSnippetResult = {
  type: 'snippet'
  id: string
  title: string
  description: string | null
  language: string
  updatedAt: string
  project: SearchProjectReference | null
}

export type SearchLabelResult = {
  type: 'label'
  id: string
  name: string
  color: string
  createdAt: string
  project: SearchProjectReference
}

export type SearchResult = SearchProjectResult | SearchTaskResult | SearchNoteResult | SearchSnippetResult | SearchLabelResult

export type SearchResponse = {
  results: SearchResult[]
  counts: {
    projects: number
    tasks: number
    notes: number
    snippets: number
    labels: number
  }
}
