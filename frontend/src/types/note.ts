export type NoteProject = { id: string; name: string; color: string | null }

export type Note = { id: string; title: string; content: string; projectId: string | null; project: NoteProject | null; createdAt: string; updatedAt: string }

export type NoteInput = { title: string; content: string; projectId?: string | null }
export type NoteListParams = { page?: number; limit?: number; search?: string; projectId?: string; sort?: 'createdAt' | 'updatedAt' | 'title'; order?: 'asc' | 'desc' }
export type NotesResponse = { notes: Note[]; pagination: { page: number; limit: number; total: number; totalPages: number } }
