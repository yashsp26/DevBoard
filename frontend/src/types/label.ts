export interface Label {
  id: string
  name: string
  color: string
  projectId: string
  createdAt: string
  _count: {
    tasks: number
  }
}

export interface CreateLabelRequest {
  name: string
  color: string
}

export interface UpdateLabelRequest {
  name?: string
  color?: string
}
