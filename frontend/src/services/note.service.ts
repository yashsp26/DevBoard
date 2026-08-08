import { apiClient } from '../api/client'
import type { Note, NoteInput, NoteListParams, NotesResponse } from '../types/note'

type ApiResponse<T> = { data: T; message: string; success: boolean }

export const noteService = {
  async createNote(payload: NoteInput) { const { data } = await apiClient.post<ApiResponse<Note>>('/v1/notes', payload); return data.data },
  async getNotes(params: NoteListParams) { const { data } = await apiClient.get<ApiResponse<NotesResponse>>('/v1/notes', { params }); return data.data },
  async getNote(noteId: string) { const { data } = await apiClient.get<ApiResponse<Note>>(`/v1/notes/${noteId}`); return data.data },
  async updateNote(noteId: string, payload: NoteInput) { const { data } = await apiClient.patch<ApiResponse<Note>>(`/v1/notes/${noteId}`, payload); return data.data },
  async deleteNote(noteId: string) { await apiClient.delete(`/v1/notes/${noteId}`) },
}
