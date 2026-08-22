import { Edit3, Eye, Heart, Trash2 } from "lucide-react";
import { ActionIconButton } from "../common/ActionIconButton";
import type { Snippet } from "../../types/snippet";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function SnippetCard({
  snippet,
  isTogglingFavorite,
  onDelete,
  onEdit,
  onView,
  onToggleFavorite,
}: {
  snippet: Snippet;
  isTogglingFavorite: boolean;
  onDelete: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onView: (snippet: Snippet) => void;
  onToggleFavorite: (snippet: Snippet) => void;
}) {
  const updated = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(snippet.updatedAt));
  return (
    <Card className="flex min-h-64 min-w-0 flex-col p-5 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)]">
      <header className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-text">
            {snippet.title}
          </h2>
          <p className="mt-1 truncate text-sm text-muted">
            {snippet.project?.name ?? "Personal snippet"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="primary">{snippet.language}</Badge>
          <ActionIconButton
            aria-label={
              snippet.isFavorite
                ? `Remove ${snippet.title} from favorites`
                : `Add ${snippet.title} to favorites`
            }
            icon={Heart}
            iconClassName={
              snippet.isFavorite ? "fill-primary text-primary" : undefined
            }
            isLoading={isTogglingFavorite}
            onClick={() => onToggleFavorite(snippet)}
          />
        </div>
      </header>
      <div className="mt-5 flex-1">
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted">
          {snippet.description || "No description added."}
        </p>
        <pre className="mt-4 max-w-full min-w-0 line-clamp-4 overflow-hidden rounded-lg bg-app p-3 text-xs leading-5 text-muted">
          <code>{snippet.code}</code>
        </pre>
      </div>
      <footer className="mt-5 flex flex-col items-start gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-muted">Updated {updated}</span>
        <div className="flex items-center gap-2">
          <ActionIconButton
            aria-label={`View ${snippet.title}`}
            icon={Eye}
            onClick={() => onView(snippet)}
          />
          <ActionIconButton
            aria-label={`Edit ${snippet.title}`}
            icon={Edit3}
            onClick={() => onEdit(snippet)}
          />
          <ActionIconButton
            aria-label={`Delete ${snippet.title}`}
            icon={Trash2}
            onClick={() => onDelete(snippet)}
          />
        </div>
      </footer>
    </Card>
  );
}
