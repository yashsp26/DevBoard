import { Edit3, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
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
      <div className="flex gap-1">
        <Button
          aria-label={`Edit ${label.name}`}
          className="size-12 min-h-0 p-0 pt-3"
          onClick={onEdit}
          variant="ghost"
        >
          <Edit3 aria-hidden="true" className="size-4" />
        </Button>
        <Button
          aria-label={`Delete ${label.name}`}
          className="size-14 min-h-0 p-0"
          isLoading={isDeleting}
          onClick={onDelete}
          variant="ghost"
        >
          <Trash2 aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
