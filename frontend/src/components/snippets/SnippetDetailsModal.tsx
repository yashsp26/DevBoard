import { CalendarDays } from "lucide-react";
import { useSnippet } from "../../services/useSnippets";
import type { Snippet } from "../../types/snippet";
import { Modal } from "../ui/Modal";
import { Skeleton } from "../ui/Skeleton";
import { SnippetPreview } from "./SnippetPreview";

export function SnippetDetailsModal({
  snippet,
  onClose,
}: {
  snippet: Snippet;
  onClose: () => void;
}) {
  const { data, isLoading } = useSnippet(snippet.id);
  const item = data ?? snippet;
  return (
    <Modal
      contentClassName="max-w-4xl"
      isOpen
      onClose={onClose}
      title={item.title}
    >
      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            {item.description || "No description added."}
          </p>
          <SnippetPreview code={item.code} language={item.language} />
          <p className="flex items-center gap-2 text-xs text-muted">
            <CalendarDays aria-hidden="true" className="size-4" />
            Updated{" "}
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(item.updatedAt))}
          </p>
        </div>
      )}
    </Modal>
  );
}
