import { queryOptions, useQuery } from '@tanstack/react-query'
import { searchApi } from '../api/search.api'
import type { SearchType } from '../types/search'

export const searchQueryKeys = {
  all: ['search'] as const,
  query: (query: string, type: SearchType) => [...searchQueryKeys.all, query, type] as const,
}

export const searchQueryOptions = (query: string, type: SearchType = 'all') => queryOptions({
  queryKey: searchQueryKeys.query(query, type),
  queryFn: ({ signal }) => searchApi.search(query, type, signal),
  enabled: query.trim().length >= 2,
})

export function useSearch(query: string, type: SearchType = 'all') {
  return useQuery(searchQueryOptions(query, type))
}
