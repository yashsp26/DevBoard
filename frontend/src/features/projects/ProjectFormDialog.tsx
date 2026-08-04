import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Textarea'
import { useCreateProject, useUpdateProject } from '../../services/useProjects'
import type { Project } from '../../types/project'
import { getApiErrorMessage } from '../../utils/apiError'
import { projectColors, projectSchema, type ProjectFormValues } from './projectSchemas'

type ProjectFormDialogProps = {
  isOpen: boolean
  onClose: () => void
  project?: Project
}

const defaultValues: ProjectFormValues = {
  color: '',
  description: '',
  name: '',
}

export function ProjectFormDialog({ isOpen, onClose, project }: ProjectFormDialogProps) {
  const isEditing = Boolean(project)
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const resetCreateProject = createProject.reset
  const resetUpdateProject = updateProject.reset
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProjectFormValues>({ defaultValues, resolver: zodResolver(projectSchema) })

  useEffect(() => {
    if (!isOpen) return

    reset(project ? {
      color: project.color && projectColors.includes(project.color as typeof projectColors[number]) ? project.color as typeof projectColors[number] : '',
      description: project.description ?? '',
      name: project.name,
    } : defaultValues)
    resetCreateProject()
    resetUpdateProject()
  }, [isOpen, project, reset, resetCreateProject, resetUpdateProject])

  const isPending = createProject.isPending || updateProject.isPending
  const onSubmit = (values: ProjectFormValues) => {
    const payload = {
      ...values,
      color: values.color || undefined,
      description: values.description || null,
    }

    if (project) {
      updateProject.mutate({ projectId: project.id, payload }, { onSuccess: onClose })
      return
    }

    createProject.mutate(payload, { onSuccess: onClose })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit project' : 'Create project'}>
      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        {(isEditing ? updateProject.error : createProject.error) && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger" role="alert">
            {getApiErrorMessage(isEditing ? updateProject.error : createProject.error, 'Unable to save the project. Please try again.')}
          </div>
        )}
        <Input autoFocus disabled={isPending} error={errors.name?.message} label="Project name" maxLength={100} placeholder="e.g. DevBoard redesign" {...register('name')} />
        <Textarea disabled={isPending} error={errors.description?.message} label="Description" maxLength={500} placeholder="What are you building?" {...register('description')} />
        <label className="grid gap-2 text-sm font-medium text-text" htmlFor="project-color">
          Project color
          <select className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" disabled={isPending} id="project-color" {...register('color')}>
            <option value="">No color</option>
            {projectColors.map((color) => <option key={color} value={color}>{color}</option>)}
          </select>
        </label>
        <div className="flex justify-end gap-3 pt-1">
          <Button disabled={isPending} onClick={onClose} variant="secondary">Cancel</Button>
          <Button isLoading={isPending} type="submit">{isEditing ? 'Save changes' : 'Create project'}</Button>
        </div>
      </form>
    </Modal>
  )
}
