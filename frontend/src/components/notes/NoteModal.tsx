import { useCreateNote, useUpdateNote } from '../../hooks/notes/useNotes'
import type { Note } from '../../types/note'
import { Modal } from '../ui/Modal'
import { NoteForm } from './NoteForm'

export function NoteModal({ note, onClose }: { note?: Note; onClose: () => void }) {
  const createNote = useCreateNote(); const updateNote = useUpdateNote(); const isEditing = Boolean(note); const mutation = isEditing ? updateNote : createNote
  return <Modal isOpen onClose={onClose} title={isEditing ? 'Edit note' : 'Create note'}><NoteForm isSubmitting={mutation.isPending} note={note} onCancel={onClose} onSubmit={(payload) => note ? updateNote.mutate({ id: note.id, payload }, { onSuccess: onClose }) : createNote.mutate(payload, { onSuccess: onClose })} /></Modal>
}
