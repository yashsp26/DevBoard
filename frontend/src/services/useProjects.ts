import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectApi } from '../api/project.api'
import { queryClient } from '../lib/queryClient'
import type { Project, ProjectListParams, ProjectListResponse } from '../types/project'
import { getApiErrorMessage } from '../utils/apiError'

export const projectQueryKeys = {
  all: ['projects'] as const,
  detail: (projectId: string) => [...projectQueryKeys.all, 'detail', projectId] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (params: ProjectListParams) => [...projectQueryKeys.lists(), params] as const,
}

const updateProjectInList = (list: ProjectListResponse | undefined, project: Project) =>
  list && {
    ...list,
    projects: list.projects.map((currentProject) =>
      currentProject.id === project.id ? { ...currentProject, ...project } : currentProject,
    ),
  }

const patchProjectInLists = (projectId: string, patch: Partial<Project>) => {
  queryClient.setQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() }, (list) =>
    list && {
      ...list,
      projects: list.projects.map((project) => project.id === projectId ? { ...project, ...patch } : project),
    },
  )
}

const invalidateProjectCaches = (projectId: string) => Promise.all([
  queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() }),
  queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) }),
])

export const projectsQueryOptions = (params: ProjectListParams = {}) =>
  queryOptions({
    queryKey: projectQueryKeys.list(params),
    queryFn: () => projectApi.getProjects(params),
  })

export function useProjects(params: ProjectListParams = {}) {
  return useQuery(projectsQueryOptions(params))
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId ?? ''),
    queryFn: () => projectApi.getProject(projectId!),
    enabled: Boolean(projectId),
  })
}

export function useCreateProject() {
  return useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() })
      toast.success('Project created.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to create the project. Please try again.')),
  })
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: projectApi.updateProject,
    onMutate: async ({ projectId, payload }) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.detail(projectId) })
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.lists() })

      const previousProject = queryClient.getQueryData<Project>(projectQueryKeys.detail(projectId))
      const previousLists = queryClient.getQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() })
      const optimisticProject = { ...previousProject, ...payload } as Project

      if (previousProject) {
        queryClient.setQueryData<Project>(projectQueryKeys.detail(projectId), optimisticProject)
      }
      patchProjectInLists(projectId, payload)

      return { previousLists, previousProject }
    },
    onError: (error, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(projectQueryKeys.detail(variables.projectId), context.previousProject)
      }
      context?.previousLists.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data))
      toast.error(getApiErrorMessage(error, 'Unable to update the project. Please try again.'))
    },
    onSuccess: async (project) => {
      queryClient.setQueryData(projectQueryKeys.detail(project.id), project)
      queryClient.setQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() }, (list) => updateProjectInList(list, project))
      toast.success('Project updated.')
    },
    onSettled: async (_data, _error, { projectId }) => {
      await invalidateProjectCaches(projectId)
    },
  })
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: projectApi.deleteProject,
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.lists() })
      const previousLists = queryClient.getQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() })

      queryClient.setQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() }, (list) =>
        list && {
          ...list,
          projects: list.projects.filter((project) => project.id !== projectId),
          pagination: { ...list.pagination, total: Math.max(0, list.pagination.total - 1) },
        },
      )

      return { previousLists }
    },
    onError: (error, _projectId, context) => {
      context?.previousLists.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data))
      toast.error(getApiErrorMessage(error, 'Unable to delete the project. Please try again.'))
    },
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectQueryKeys.detail(projectId) })
      toast.success('Project deleted.')
    },
    onSettled: async (_data, _error, projectId) => {
      await invalidateProjectCaches(projectId)
    },
  })
}

function useProjectAction(
  mutationFn: (projectId: string) => Promise<Project>,
  getOptimisticPatch: (project: Project) => Partial<Project>,
  successMessage: string,
  errorMessage: string,
) {
  return useMutation({
    mutationFn,
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.detail(projectId) })
      await queryClient.cancelQueries({ queryKey: projectQueryKeys.lists() })

      const previousProject = queryClient.getQueryData<Project>(projectQueryKeys.detail(projectId))
      const previousLists = queryClient.getQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() })
      const sourceProject = previousProject ?? previousLists.flatMap(([, list]) => list?.projects ?? []).find((project) => project.id === projectId)

      if (sourceProject) {
        const patch = getOptimisticPatch(sourceProject)
        queryClient.setQueryData<Project>(projectQueryKeys.detail(projectId), { ...sourceProject, ...patch })
        patchProjectInLists(projectId, patch)
      }

      return { previousLists, previousProject }
    },
    onError: (error, projectId, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(projectQueryKeys.detail(projectId), context.previousProject)
      }
      context?.previousLists.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data))
      toast.error(getApiErrorMessage(error, errorMessage))
    },
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueryKeys.detail(project.id), project)
      queryClient.setQueriesData<ProjectListResponse>({ queryKey: projectQueryKeys.lists() }, (list) => updateProjectInList(list, project))
      toast.success(successMessage)
    },
    onSettled: async (_data, _error, projectId) => {
      await invalidateProjectCaches(projectId)
    },
  })
}

export function useToggleFavorite() {
  return useProjectAction(
    projectApi.toggleFavorite,
    (project) => ({ isFavorite: !project.isFavorite }),
    'Project favorite updated.',
    'Unable to update the project favorite. Please try again.',
  )
}

export function useArchiveProject() {
  return useProjectAction(
    projectApi.archiveProject,
    () => ({ status: 'ARCHIVED' }),
    'Project archived.',
    'Unable to archive the project. Please try again.',
  )
}

export function useUnarchiveProject() {
  return useProjectAction(
    projectApi.unarchiveProject,
    () => ({ status: 'ACTIVE' }),
    'Project unarchived.',
    'Unable to unarchive the project. Please try again.',
  )
}
