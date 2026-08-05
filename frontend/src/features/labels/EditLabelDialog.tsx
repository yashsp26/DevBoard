import { LabelFormDialog } from './LabelFormDialog'
import type { Label } from '../../types/label'
export function EditLabelDialog({ label, onClose, projectId }: { label?: Label; onClose: () => void; projectId: string }) { return label ? <LabelFormDialog label={label} onClose={onClose} projectId={projectId} /> : null }
