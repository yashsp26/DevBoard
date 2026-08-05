import { Plus, Tags } from 'lucide-react'
import { EmptyState } from '../../components/common/EmptyState'
import { Button } from '../../components/ui/Button'

export function EmptyLabels({ onCreate }: { onCreate: () => void }) {
  return <EmptyState action={<Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create Label</Button>} description="Create labels to organize your tasks." icon={Tags} title="No labels yet" />
}
