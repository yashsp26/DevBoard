import type { ProjectSortField, ProjectStatus, SortOrder } from '../../types/project'
import { Select } from '../../components/ui/Select'

type ProjectFiltersProps = {
  favorite: boolean | undefined
  onFavoriteChange: (favorite: boolean | undefined) => void
  onOrderChange: (order: SortOrder) => void
  onSortChange: (sort: ProjectSortField) => void
  onStatusChange: (status: ProjectStatus | undefined) => void
  order: SortOrder
  sort: ProjectSortField
  status: ProjectStatus | undefined
}

export function ProjectFilters({ favorite, onFavoriteChange, onOrderChange, onSortChange, onStatusChange, order, sort, status }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select aria-label="Status" onValueChange={(value) => onStatusChange(value ? value as ProjectStatus : undefined)} options={[{ label: 'All statuses', value: '' }, { label: 'Active', value: 'ACTIVE' }, { label: 'Archived', value: 'ARCHIVED' }]} value={status ?? ''} />
      <Select aria-label="Favorite" onValueChange={(value) => onFavoriteChange(value === '' ? undefined : value === 'true')} options={[{ label: 'All projects', value: '' }, { label: 'Favorites', value: 'true' }, { label: 'Not favorites', value: 'false' }]} value={favorite === undefined ? '' : String(favorite)} />
      <Select aria-label="Sort projects" onValueChange={(value) => onSortChange(value as ProjectSortField)} options={[{ label: 'Last updated', value: 'updatedAt' }, { label: 'Date created', value: 'createdAt' }, { label: 'Name', value: 'name' }]} value={sort} />
      <Select aria-label="Sort direction" onValueChange={(value) => onOrderChange(value as SortOrder)} options={[{ label: 'Descending', value: 'desc' }, { label: 'Ascending', value: 'asc' }]} value={order} />
    </div>
  )
}
