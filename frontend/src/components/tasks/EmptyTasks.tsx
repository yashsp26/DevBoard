import { CheckSquare2, Plus } from 'lucide-react'
import { EmptyState } from '../common/EmptyState'
import { Button } from '../ui/Button'

export interface EmptyTasksProps {
  onCreate: () => void
}

export function EmptyTasks({ onCreate }: EmptyTasksProps) {
  return <EmptyState action={<Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create Task</Button>} description="Create a task to start planning the work in this project." icon={CheckSquare2} title="No tasks yet" />
}
