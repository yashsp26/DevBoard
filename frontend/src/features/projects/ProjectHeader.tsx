import { Plus } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'

type ProjectHeaderProps = {
  onCreate: () => void
}

export function ProjectHeader({ onCreate }: ProjectHeaderProps) {
  return (
    <PageHeader
      actions={<Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create project</Button>}
      description="Organize the code, notes, and tasks behind your development work."
      title="Projects"
    />
  )
}
