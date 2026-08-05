import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useDeleteLabel, useLabels } from "../../services/useLabels";
import type { Label } from "../../types/label";
import { CreateLabelDialog } from "./CreateLabelDialog";
import { DeleteLabelDialog } from "./DeleteLabelDialog";
import { EditLabelDialog } from "./EditLabelDialog";
import { EmptyLabels } from "./EmptyLabels";
import { LabelList } from "./LabelList";
import { LabelSkeleton } from "./LabelSkeleton";

export function LabelsSection({ projectId }: { projectId: string }) {
  const { data: labels, isLoading } = useLabels(projectId);
  const deleteLabel = useDeleteLabel();
  const [editingLabel, setEditingLabel] = useState<Label>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingLabel, setDeletingLabel] = useState<Label>();
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">Labels</h2>
          <p className="text-sm text-muted">
            Group related tasks with project labels.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus aria-hidden="true" className="size-4" />
          Create Label
        </Button>
      </div>
      {isLoading ? (
        <LabelSkeleton />
      ) : labels?.length ? (
        <LabelList
          deletingLabelId={
            deleteLabel.isPending ? deleteLabel.variables.labelId : undefined
          }
          labels={labels}
          onDelete={setDeletingLabel}
          onEdit={setEditingLabel}
        />
      ) : (
        <EmptyLabels onCreate={() => setIsCreateOpen(true)} />
      )}
      <CreateLabelDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectId={projectId}
      />
      <EditLabelDialog
        label={editingLabel}
        onClose={() => setEditingLabel(undefined)}
        projectId={projectId}
      />
      <DeleteLabelDialog
        isDeleting={deleteLabel.isPending}
        isOpen={Boolean(deletingLabel)}
        label={deletingLabel}
        onClose={() => setDeletingLabel(undefined)}
        onConfirm={() =>
          deletingLabel &&
          deleteLabel.mutate(
            { labelId: deletingLabel.id, projectId },
            { onSuccess: () => setDeletingLabel(undefined) },
          )
        }
      />
    </section>
  );
}
