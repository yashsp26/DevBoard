import type { Snippet } from "../../types/snippet";
import { Dialog } from "../ui/Dialog";
import { useDeleteSnippet } from "../../services/useSnippets";

export function DeleteSnippetDialog({
  snippet,
  onClose,
}: {
  snippet: Snippet;
  onClose: () => void;
}) {
  const remove = useDeleteSnippet();
  return (
    <Dialog
      confirmLabel="Delete snippet"
      isLoading={remove.isPending}
      isOpen
      onClose={onClose}
      onConfirm={() => remove.mutate(snippet.id, { onSuccess: onClose })}
      title="Delete snippet"
      variant="danger"
    >
      Delete “{snippet.title}”? This cannot be undone.
    </Dialog>
  );
}
