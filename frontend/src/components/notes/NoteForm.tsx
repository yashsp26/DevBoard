import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useProjects } from '../../services/useProjects'
import type { Note, NoteInput } from '../../types/note'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'

const schema = z.object({ title: z.string().trim().min(1, 'Enter a note title.').max(150, 'Title cannot exceed 150 characters.'), content: z.string().trim().min(1, 'Enter note content.').max(50000, 'Content cannot exceed 50,000 characters.'), projectId: z.string() })
type Values = z.infer<typeof schema>
export function NoteForm({ note, isSubmitting, onCancel, onSubmit }: { note?: Note; isSubmitting: boolean; onCancel: () => void; onSubmit: (input: NoteInput) => void }) {
  const { data: projects } = useProjects({ limit: 100, sort: 'name', order: 'asc' })
  const { formState: { errors }, handleSubmit, register } = useForm<Values>({ defaultValues: { title: note?.title ?? '', content: note?.content ?? '', projectId: note?.projectId ?? '' }, resolver: zodResolver(schema) })
  return <form className="space-y-5" noValidate onSubmit={handleSubmit((values) => onSubmit({ content: values.content, projectId: values.projectId || null, title: values.title }))}><Input autoFocus disabled={isSubmitting} error={errors.title?.message} label="Title" {...register('title')} /><Textarea disabled={isSubmitting} error={errors.content?.message} label="Content" {...register('content')} /><label className="grid gap-2 text-sm font-medium text-text" htmlFor="note-project">Project (optional)<select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" disabled={isSubmitting} id="note-project" {...register('projectId')}><option value="">Personal Note</option>{projects?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label><div className="flex justify-end gap-3"><Button disabled={isSubmitting} onClick={onCancel} variant="secondary">Cancel</Button><Button isLoading={isSubmitting} type="submit">{note ? 'Save changes' : 'Create note'}</Button></div></form>
}
