import { AlertCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/ui/Button'
import { EmptyProjects } from '../features/projects/EmptyProjects'
import { CreateProjectDialog } from '../features/projects/CreateProjectDialog'
import { EditProjectDialog } from '../features/projects/EditProjectDialog'
import { ProjectFilters } from '../features/projects/ProjectFilters'
import { ProjectGrid } from '../features/projects/ProjectGrid'
import { ProjectGridSkeleton } from '../features/projects/ProjectGridSkeleton'
import { ProjectHeader } from '../features/projects/ProjectHeader'
import { ProjectPagination } from '../features/projects/ProjectPagination'
import { ProjectSearch } from '../features/projects/ProjectSearch'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useArchiveProject, useDeleteProject, useProjects, useToggleFavorite, useUnarchiveProject } from '../services/useProjects'
import type { Project, ProjectListParams, ProjectSortField, ProjectStatus, SortOrder } from '../types/project'

const pageSize = 12

function getPositiveInteger(value: string | null, fallback: number) {
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback
}

function getStatus(value: string | null): ProjectStatus | undefined {
  return value === 'ACTIVE' || value === 'ARCHIVED' ? value : undefined
}

function getSort(value: string | null): ProjectSortField {
  return value === 'name' || value === 'createdAt' || value === 'updatedAt' ? value : 'updatedAt'
}

function getOrder(value: string | null): SortOrder {
  return value === 'asc' || value === 'desc' ? value : 'desc'
}

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const page = getPositiveInteger(searchParams.get('page'), 1)
  const status = getStatus(searchParams.get('status'))
  const favoriteValue = searchParams.get('favorite')
  const favorite = favoriteValue === 'true' ? true : favoriteValue === 'false' ? false : undefined
  const sort = getSort(searchParams.get('sort'))
  const order = getOrder(searchParams.get('order'))
  const [searchValue, setSearchValue] = useState(search)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project>()
  const navigate = useNavigate()
  const debouncedSearch = useDebouncedValue(searchValue)

  const updateParams = useCallback((updates: Record<string, string | undefined>, resetPage = true) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') nextParams.delete(key)
        else nextParams.set(key, value)
      })
      if (resetPage) nextParams.delete('page')
      return nextParams
    })
  }, [setSearchParams])

  useEffect(() => {
    setSearchValue(search)
  }, [search])

  useEffect(() => {
    if (debouncedSearch !== search) updateParams({ search: debouncedSearch || undefined })
  }, [debouncedSearch, search, updateParams])

  const listParams = useMemo<ProjectListParams>(() => ({ favorite, limit: pageSize, order, page, search: search || undefined, sort, status }), [favorite, order, page, search, sort, status])
  const { data, error, isError, isLoading, refetch } = useProjects(listParams)
  const deleteProject = useDeleteProject()
  const toggleFavorite = useToggleFavorite()
  const archiveProject = useArchiveProject()
  const unarchiveProject = useUnarchiveProject()

  const openCreateDialog = () => {
    setEditingProject(undefined)
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <ProjectHeader onCreate={openCreateDialog} />
      <section aria-label="Project controls" className="space-y-3">
        <ProjectSearch onChange={setSearchValue} value={searchValue} />
        <ProjectFilters
          favorite={favorite}
          onFavoriteChange={(value) => updateParams({ favorite: value === undefined ? undefined : String(value) })}
          onOrderChange={(value) => updateParams({ order: value })}
          onSortChange={(value) => updateParams({ sort: value })}
          onStatusChange={(value) => updateParams({ status: value })}
          order={order}
          sort={sort}
          status={status}
        />
      </section>
      {isLoading ? <ProjectGridSkeleton /> : isError ? (
        <EmptyState action={<Button onClick={() => void refetch()}>Try again</Button>} description={error instanceof Error ? error.message : 'We couldn’t load your projects. Please try again.'} icon={AlertCircle} title="Projects unavailable" />
      ) : data?.projects.length ? (
        <>
          <ProjectGrid
            archivingProjectId={archiveProject.isPending ? archiveProject.variables : unarchiveProject.isPending ? unarchiveProject.variables : undefined}
            deletingProjectId={deleteProject.isPending ? deleteProject.variables : undefined}
            onArchive={(project) => project.status === 'ARCHIVED' ? unarchiveProject.mutate(project.id) : archiveProject.mutate(project.id)}
            onDelete={(project) => deleteProject.mutate(project.id)}
            onEdit={openEditDialog}
            onOpen={(project) => navigate(`/projects/${project.id}`)}
            onToggleFavorite={(project) => toggleFavorite.mutate(project.id)}
            projects={data.projects}
            togglingFavoriteProjectId={toggleFavorite.isPending ? toggleFavorite.variables : undefined}
          />
          <ProjectPagination onPageChange={(nextPage) => updateParams({ page: String(nextPage) }, false)} pagination={data.pagination} />
        </>
      ) : <EmptyProjects onCreate={openCreateDialog} />}
      <CreateProjectDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
      <EditProjectDialog onClose={() => setEditingProject(undefined)} project={editingProject} />
    </main>
  )
}
