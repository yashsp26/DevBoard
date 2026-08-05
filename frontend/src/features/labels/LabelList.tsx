import type { Label } from "../../types/label";
import { LabelCard } from "./LabelCard";

export function LabelList({
  deletingLabelId,
  labels,
  onDelete,
  onEdit,
}: {
  deletingLabelId?: string;
  labels: Label[];
  onDelete: (label: Label) => void;
  onEdit: (label: Label) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {labels.map((label) => (
        <LabelCard
          isDeleting={deletingLabelId === label.id}
          key={label.id}
          label={label}
          onDelete={() => onDelete(label)}
          onEdit={() => onEdit(label)}
        />
      ))}
    </div>
  );
}
