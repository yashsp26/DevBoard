import { Edit3, FileText, Trash2 } from 'lucide-react'
import { ActionIconButton } from '../common/ActionIconButton'
import type { Note } from '../../types/note'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

export function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: (note: Note) => void; onDelete: (note: Note) => void }) {
  const updated = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt))
  return <Card className="flex min-h-64 flex-col p-5 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)]"><header className="flex min-w-0 items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><FileText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" /><div className="min-w-0"><h2 className="truncate text-lg font-semibold text-text">{note.title}</h2><p className="mt-1 text-sm text-muted">{note.project?.name ?? 'Personal note'}</p></div></div><Badge aria-label={note.project ? `Project: ${note.project.name}` : 'Personal Note'} variant={note.project ? 'primary' : 'default'}>{note.project?.name ?? 'Personal'}</Badge></header><div className="mt-5 flex-1"><p className="line-clamp-5 text-sm leading-6 text-muted">{note.content}</p></div><footer className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4"><span className="text-xs text-muted">Updated {updated}</span><div className="flex items-center gap-2"><ActionIconButton aria-label={`Edit ${note.title}`} icon={Edit3} onClick={() => onEdit(note)} /><ActionIconButton aria-label={`Delete ${note.title}`} icon={Trash2} onClick={() => onDelete(note)} /></div></footer></Card>
}
