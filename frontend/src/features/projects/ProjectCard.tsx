import {
  Archive,
  Box,
  Edit3,
  ExternalLink,
  FileText,
  FolderKanban,
  Heart,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { ActionIconButton } from "../../components/common/ActionIconButton";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { Project } from "../../types/project";
import { cn } from "../../utils/cn";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

type ProjectCardProps = {
  isArchiving: boolean;
  isDeleting: boolean;
  isTogglingFavorite: boolean;
  onArchive: (project: Project) => void;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
  onOpen: (project: Project) => void;
  onToggleFavorite: (project: Project) => void;
  project: Project;
};

export function ProjectCard({
  isArchiving,
  isDeleting,
  isTogglingFavorite,
  onArchive,
  onDelete,
  onEdit,
  onOpen,
  onToggleFavorite,
  project,
}: ProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const counts = project._count ?? {
    labels: 0,
    notes: 0,
    snippets: 0,
    tasks: 0,
  };
  const isArchived = project.status === "ARCHIVED";
  const updatedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(project.updatedAt));

  return (
    <Card
      className={cn(
        "flex min-w-0 flex-col p-5 transition-all",
        isArchived
          ? "bg-app opacity-75 hover:opacity-100"
          : "hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-label="Project color"
          className="size-10 shrink-0 rounded-xl border border-border-subtle shadow-sm"
          style={{ backgroundColor: project.color ?? "var(--color-primary)" }}
        />
        <div className="flex items-center gap-2">
          <Badge variant={isArchived ? "warning" : "success"}>
            {isArchived ? "Archived" : "Active"}
          </Badge>
          <ActionIconButton
            aria-label={
              project.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            icon={Heart}
            iconClassName={
              project.isFavorite ? "fill-primary text-primary" : undefined
            }
            isLoading={isTogglingFavorite}
            onClick={() => onToggleFavorite(project)}
          />
        </div>
      </div>
      <div className="mt-5 min-w-0 space-y-2">
        <h2 className="truncate text-lg font-semibold text-text">
          {project.name}
        </h2>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted">
          {project.description || "No description added."}
        </p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border py-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <FolderKanban aria-hidden="true" className="size-4" />
          <dt className="sr-only">Tasks</dt>
          <dd>{counts.tasks} tasks</dd>
        </div>
        <div className="flex items-center gap-2">
          <FileText aria-hidden="true" className="size-4" />
          <dt className="sr-only">Notes</dt>
          <dd>{counts.notes} notes</dd>
        </div>
        <div className="flex items-center gap-2">
          <Box aria-hidden="true" className="size-4" />
          <dt className="sr-only">Snippets</dt>
          <dd>{counts.snippets} snippets</dd>
        </div>
        <div className="flex items-center gap-2">
          <Tag aria-hidden="true" className="size-4" />
          <dt className="sr-only">Labels</dt>
          <dd>{counts.labels} labels</dd>
        </div>
      </dl>
      <footer className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="whitespace-nowrap text-xs text-muted">
            Updated {updatedAt}
          </p>

          <div className="flex items-center gap-2">
            <ActionIconButton
              aria-label={`Edit ${project.name}`}
              icon={Edit3}
              onClick={() => onEdit(project)}
            />

            <ActionIconButton
              aria-label={`Delete ${project.name}`}
              icon={Trash2}
              isLoading={isDeleting}
              onClick={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onOpen(project)}
            variant="secondary"
          >
            <ExternalLink className="size-4" />
            Open
          </Button>

          <Button
            className="flex-1"
            isLoading={isArchiving}
            onClick={() => onArchive(project)}
            variant="ghost"
          >
            <Archive className="size-4" />
            {isArchived ? "Restore" : "Archive"}
          </Button>
        </div>
      </footer>
      <DeleteProjectDialog
        isDeleting={isDeleting}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDelete(project)}
        project={project}
      />
    </Card>
  );
}
