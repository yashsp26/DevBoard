import { FolderKanban, Plus } from "lucide-react";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/ui/Button";

type EmptyProjectsProps = {
  onCreate: () => void;
};

export function EmptyProjects({ onCreate }: EmptyProjectsProps) {
  return (
    <EmptyState
      action={
        <Button onClick={onCreate}>
          <Plus aria-hidden="true" className="size-4" />
          Create Project
        </Button>
      }
      description="Create your first project and start organizing your work."
      icon={FolderKanban}
      title="No projects yet"
    />
  );
}
