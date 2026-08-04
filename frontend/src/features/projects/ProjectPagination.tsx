import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import type { ProjectPagination as ProjectPaginationData } from '../../types/project'

type ProjectPaginationProps = {
  onPageChange: (page: number) => void
  pagination: ProjectPaginationData
}

export function ProjectPagination({ onPageChange, pagination }: ProjectPaginationProps) {
  if (pagination.totalPages <= 1) return null

  return (
    <nav aria-label="Project pagination" className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">Page {pagination.page} of {pagination.totalPages} · {pagination.total} projects</p>
      <div className="flex gap-2">
        <Button disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.page - 1)} variant="secondary"><ChevronLeft aria-hidden="true" className="size-4" />Previous</Button>
        <Button disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)} variant="secondary">Next<ChevronRight aria-hidden="true" className="size-4" /></Button>
      </div>
    </nav>
  )
}
