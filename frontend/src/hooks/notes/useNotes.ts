import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '../../lib/queryClient'
import { noteService } from '../../services/note.service'
import type { NoteInput, NoteListParams } from '../../types/note'
import { getApiErrorMessage } from '../../utils/apiError'
import { noteQueryKeys } from './noteQueryKeys'

export function useNotes(params: NoteListParams) { return useQuery({ queryKey: noteQueryKeys.list(params), queryFn: () => noteService.getNotes(params) }) }
export function useCreateNote() { return useMutation({ mutationFn: (payload: NoteInput) => noteService.createNote(payload), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }); toast.success('Note created.') }, onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to create the note. Please try again.')) }) }
export function useUpdateNote() { return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: NoteInput }) => noteService.updateNote(id, payload), onSuccess: async (note) => { queryClient.setQueryData(noteQueryKeys.detail(note.id), note); await queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }); toast.success('Note updated.') }, onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to update the note. Please try again.')) }) }
export function useDeleteNote() { return useMutation({ mutationFn: noteService.deleteNote, onSuccess: async (_data, id) => { queryClient.removeQueries({ queryKey: noteQueryKeys.detail(id) }); await queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }); toast.success('Note deleted.') }, onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to delete the note. Please try again.')) }) }
