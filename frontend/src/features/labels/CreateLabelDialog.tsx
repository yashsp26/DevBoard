import { LabelFormDialog } from './LabelFormDialog'
export function CreateLabelDialog({ isOpen, onClose, projectId }: { isOpen: boolean; onClose: () => void; projectId: string }) { return isOpen ? <LabelFormDialog onClose={onClose} projectId={projectId} /> : null }
