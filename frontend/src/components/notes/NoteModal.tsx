import { useCreateNote, useUpdateNote } from '../../hooks/notes/useNotes'
import { useId } from 'react'
import type { Note } from '../../types/note'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { NoteForm } from './NoteForm'

export function NoteModal({ note, onClose }: { note?: Note; onClose: () => void }) {
  const createNote = useCreateNote(); const updateNote = useUpdateNote(); const isEditing = Boolean(note); const mutation = isEditing ? updateNote : createNote
  const formId = useId()
  return <Modal bodyClassName="min-h-0 flex-1 overflow-y-auto p-5" footer={<div className="ml-auto flex items-center gap-3"><Button disabled={mutation.isPending} onClick={onClose} variant="secondary">Cancel</Button><Button form={formId} isLoading={mutation.isPending} type="submit">{isEditing ? 'Save changes' : 'Create note'}</Button></div>} isOpen onClose={onClose} size="medium" title={isEditing ? 'Edit note' : 'Create note'}><NoteForm formId={formId} isSubmitting={mutation.isPending} note={note} onSubmit={(payload) => note ? updateNote.mutate({ id: note.id, payload }, { onSuccess: onClose }) : createNote.mutate(payload, { onSuccess: onClose })} /></Modal>
}
