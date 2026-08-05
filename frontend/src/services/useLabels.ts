import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { labelApi } from '../api/label.api'
import { projectQueryKeys } from './useProjects'
import { queryClient } from '../lib/queryClient'
import type { CreateLabelRequest, UpdateLabelRequest } from '../types/label'
import { getApiErrorMessage } from '../utils/apiError'

export const labelQueryKeys = {
  all: ['labels'] as const,
  list: (projectId: string) => [...labelQueryKeys.all, 'list', projectId] as const,
}

export const labelsQueryOptions = (projectId: string) => queryOptions({
  queryKey: labelQueryKeys.list(projectId),
  queryFn: () => labelApi.getLabels(projectId),
  enabled: Boolean(projectId),
})

export function useLabels(projectId: string | undefined) {
  return useQuery({
    ...labelsQueryOptions(projectId ?? ''),
    enabled: Boolean(projectId),
  })
}

function invalidateLabelCaches(projectId: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: labelQueryKeys.list(projectId) }),
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(projectId) }),
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() }),
  ])
}

export function useCreateLabel() {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateLabelRequest }) => labelApi.createLabel(projectId, data),
    onSuccess: async (_label, { projectId }) => {
      await invalidateLabelCaches(projectId)
      toast.success('Label created.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to create the label. Please try again.')),
  })
}

export function useUpdateLabel() {
  return useMutation({
    mutationFn: ({ labelId, data }: { labelId: string; projectId: string; data: UpdateLabelRequest }) => labelApi.updateLabel(labelId, data),
    onSuccess: async (_label, { projectId }) => {
      await invalidateLabelCaches(projectId)
      toast.success('Label updated.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to update the label. Please try again.')),
  })
}

export function useDeleteLabel() {
  return useMutation({
    mutationFn: ({ labelId }: { labelId: string; projectId: string }) => labelApi.deleteLabel(labelId),
    onSuccess: async (_data, { projectId }) => {
      await invalidateLabelCaches(projectId)
      toast.success('Label deleted.')
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to delete the label. Please try again.')),
  })
}
