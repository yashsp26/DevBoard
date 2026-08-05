import { Badge } from '../ui/Badge'
import type { Label } from '../../types/label'

export interface TaskLabelProps {
  label: Pick<Label, 'color' | 'name'>
}

export function TaskLabel({ label }: TaskLabelProps) {
  return <Badge><span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: label.color }} />{label.name}</Badge>
}
