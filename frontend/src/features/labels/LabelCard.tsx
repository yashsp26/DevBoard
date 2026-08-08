import { Edit3, Trash2 } from "lucide-react";
import { ActionIconButton } from "../../components/common/ActionIconButton";
import { Card } from "../../components/ui/Card";
import type { Label } from "../../types/label";

export function LabelCard({
  isDeleting,
  label,
  onDelete,
  onEdit,
}: {
  isDeleting: boolean;
  label: Label;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span
        aria-label={`${label.name} color`}
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: label.color }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-text">{label.name}</h3>
        <p className="text-sm text-muted">{label._count?.tasks ?? 0} Tasks</p>
      </div>
      <div className="flex items-center gap-2">
        <ActionIconButton
          aria-label={`Edit ${label.name}`}
          icon={Edit3}
          onClick={onEdit}
        />
        <ActionIconButton
          aria-label={`Delete ${label.name}`}
          icon={Trash2}
          isLoading={isDeleting}
          onClick={onDelete}
        />
      </div>
    </Card>
  );
}
