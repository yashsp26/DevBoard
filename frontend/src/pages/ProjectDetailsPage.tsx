import { isAxiosError } from "axios";
import {
  AlertCircle,
  Boxes,
  CloudOff,
  FolderKanban,
  ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { ProjectDetailsHeader } from "../features/projects/ProjectDetailsHeader";
import { ProjectOverview } from "../features/projects/ProjectOverview";
import { ProjectStats } from "../features/projects/ProjectStats";
import { LabelsSection } from "../features/labels/LabelsSection";
import { useProject } from "../services/useProjects";

const modules = ["Snippets"];

export function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, error, isError, isLoading, refetch } = useProject(id);
  const status = isAxiosError(error) ? error.response?.status : undefined;

  if (isLoading)
    return (
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Skeleton className="h-32" key={module} />
          ))}
        </div>
      </main>
    );
  if (isError) {
    const isMissing = status === 404;
    const isUnauthorized = status === 401;
    const isNetworkError = isAxiosError(error) && !error.response;
    return (
      <main className="mx-auto grid min-h-[60vh] w-full max-w-6xl place-items-center px-6 py-10 sm:px-8">
        <EmptyState
          action={
            isUnauthorized ? (
              <Button onClick={() => navigate("/login")}>Sign in</Button>
            ) : (
              <Button
                onClick={() =>
                  isNetworkError ? window.location.reload() : void refetch()
                }
              >
                {isNetworkError ? "Try again" : "Retry"}
              </Button>
            )
          }
          description={
            isMissing
              ? "This project does not exist or is no longer available."
              : isUnauthorized
                ? "Sign in again to access this project."
                : isNetworkError
                  ? "DevBoard could not reach the server. Check your connection and try again."
                  : "We couldn’t load this project. Please try again."
          }
          icon={
            isMissing
              ? FolderKanban
              : isUnauthorized
                ? ShieldAlert
                : isNetworkError
                  ? CloudOff
                  : AlertCircle
          }
          title={
            isMissing
              ? "Project not found"
              : isUnauthorized
                ? "Authentication required"
                : isNetworkError
                  ? "Connection problem"
                  : "Project unavailable"
          }
        />
      </main>
    );
  }
  if (!project) return null;
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <ProjectDetailsHeader
        onBack={() => navigate("/projects")}
        onOpenTasks={() => navigate(`/projects/${project.id}/tasks`)}
        project={project}
      />
      <ProjectOverview project={project} />
      <ProjectStats project={project} />
      <LabelsSection projectId={project.id} />
      <section>
        <h2 className="mb-3 text-base font-semibold text-text">
          Workspace modules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Card className="p-5" key={module}>
              <Boxes aria-hidden="true" className="size-5 text-muted" />
              <h3 className="mt-4 font-semibold text-text">{module}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">
                {module} will be available here in a future release.
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
