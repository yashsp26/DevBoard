import { useDeleteNote } from '../../hooks/notes/useNotes'
import type { Note } from '../../types/note'
import { Dialog } from '../ui/Dialog'

export function DeleteNoteDialog({ note, onClose }: { note: Note; onClose: () => void }) { const deletion = useDeleteNote(); return <Dialog confirmLabel="Delete note" isLoading={deletion.isPending} isOpen onClose={onClose} onConfirm={() => deletion.mutate(note.id, { onSuccess: onClose })} title="Delete this note?" variant="danger">This permanently deletes <strong className="font-semibold text-text">{note.title}</strong>. This action cannot be undone.</Dialog> }
