import { FileText, Plus } from 'lucide-react'
import { EmptyState } from '../common/EmptyState'
import { Button } from '../ui/Button'
export function EmptyNotes({ onCreate }: { onCreate: () => void }) { return <EmptyState action={<Button onClick={onCreate}><Plus aria-hidden="true" className="size-4" />Create Note</Button>} description="Capture an idea or save project context for later." icon={FileText} title="No notes yet" /> }
