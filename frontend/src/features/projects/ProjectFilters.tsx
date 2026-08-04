import type { ProjectSortField, ProjectStatus, SortOrder } from '../../types/project'

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

const selectClassName = 'min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

export function ProjectFilters({ favorite, onFavoriteChange, onOrderChange, onSortChange, onStatusChange, order, sort, status }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="sr-only" htmlFor="project-status">Status</label>
      <select className={selectClassName} id="project-status" onChange={(event) => onStatusChange(event.target.value ? event.target.value as ProjectStatus : undefined)} value={status ?? ''}>
        <option value="">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      <label className="sr-only" htmlFor="project-favorite">Favorite</label>
      <select className={selectClassName} id="project-favorite" onChange={(event) => onFavoriteChange(event.target.value === '' ? undefined : event.target.value === 'true')} value={favorite === undefined ? '' : String(favorite)}>
        <option value="">All projects</option>
        <option value="true">Favorites</option>
        <option value="false">Not favorites</option>
      </select>
      <label className="sr-only" htmlFor="project-sort">Sort projects</label>
      <select className={selectClassName} id="project-sort" onChange={(event) => onSortChange(event.target.value as ProjectSortField)} value={sort}>
        <option value="updatedAt">Last updated</option>
        <option value="createdAt">Date created</option>
        <option value="name">Name</option>
      </select>
      <label className="sr-only" htmlFor="project-order">Sort direction</label>
      <select className={selectClassName} id="project-order" onChange={(event) => onOrderChange(event.target.value as SortOrder)} value={order}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  )
}
