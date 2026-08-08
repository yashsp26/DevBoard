import type { NoteListParams } from '../../types/note'

const serialize = (params: NoteListParams) => JSON.stringify(Object.entries(params).filter(([, value]) => value !== undefined).sort(([a], [b]) => a.localeCompare(b)))
export const noteQueryKeys = { all: ['notes'] as const, lists: () => [...noteQueryKeys.all, 'list'] as const, list: (params: NoteListParams) => [...noteQueryKeys.lists(), serialize(params)] as const, detail: (id: string) => [...noteQueryKeys.all, 'detail', id] as const }
