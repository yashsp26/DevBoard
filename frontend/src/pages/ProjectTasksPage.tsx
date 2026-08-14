import { isAxiosError } from "axios";
import { AlertCircle, CloudOff, FolderKanban, ShieldAlert } from "lucide-react";
import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { EmptyState } from "../components/common/EmptyState";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { EditTaskModal } from "../components/tasks/EditTaskModal";
import { TaskList } from "../components/tasks/TaskList";
import { TaskModal } from "../components/tasks/TaskModal";
import { TaskToolbar } from "../components/tasks/TaskToolbar";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { ProjectDetailsHeader } from "../features/projects/ProjectDetailsHeader";
import { useTask } from "../hooks/tasks/useTask";
import { useProject } from "../services/useProjects";
import type { Task } from "../types/task";

const clearModalParams = (params: URLSearchParams) => {
  params.delete("modal");
  params.delete("task");
  params.delete("edit");
};

export function ProjectTasksPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: project,
    error,
    isError,
    isLoading,
    refetch,
  } = useProject(projectId);
  const taskId = searchParams.get("task") ?? undefined;
  const editTaskId = searchParams.get("edit") ?? undefined;
  const { data: editTask } = useTask(editTaskId);
  const status = isAxiosError(error) ? error.response?.status : undefined;
  const updateModal = useCallback(
    (update: (params: URLSearchParams) => void) =>
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        update(next);
        return next;
      }),
    [setSearchParams],
  );
  const closeModal = useCallback(
    () => updateModal(clearModalParams),
    [updateModal],
  );
  const openCreate = useCallback(
    () =>
      updateModal((params) => {
        clearModalParams(params);
        params.set("modal", "create");
      }),
    [updateModal],
  );
  const openTask = useCallback(
    (task: Task) =>
      updateModal((params) => {
        clearModalParams(params);
        params.set("task", task.id);
      }),
    [updateModal],
  );
  const openEdit = useCallback(
    (task: Task) =>
      updateModal((params) => {
        clearModalParams(params);
        params.set("edit", task.id);
      }),
    [updateModal],
  );
  const editFromDetails = useCallback(
    (id: string) =>
      updateModal((params) => {
        params.delete("task");
        params.delete("modal");
        params.set("edit", id);
      }),
    [updateModal],
  );

  if (isLoading)
    return (
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </main>
    );
  if (isError) {
    const missing = status === 404;
    const unauthorized = status === 401;
    const network = isAxiosError(error) && !error.response;
    return (
      <main className="mx-auto grid min-h-[60vh] w-full max-w-6xl place-items-center px-6 py-10 sm:px-8">
        <EmptyState
          action={
            unauthorized ? (
              <Button onClick={() => navigate("/login")}>Sign in</Button>
            ) : (
              <Button
                onClick={() =>
                  network ? window.location.reload() : void refetch()
                }
              >
                {network ? "Try again" : "Retry"}
              </Button>
            )
          }
          description={
            missing
              ? "This project does not exist or is no longer available."
              : unauthorized
                ? "Sign in again to access this project."
                : network
                  ? "DevLupo could not reach the server. Check your connection and try again."
                  : "We couldn’t load this project. Please try again."
          }
          icon={
            missing
              ? FolderKanban
              : unauthorized
                ? ShieldAlert
                : network
                  ? CloudOff
                  : AlertCircle
          }
          title={
            missing
              ? "Project not found"
              : unauthorized
                ? "Authentication required"
                : network
                  ? "Connection problem"
                  : "Project unavailable"
          }
        />
      </main>
    );
  }
  if (!project || !projectId) return null;
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <ProjectDetailsHeader
        isTasksPage
        onBack={() => navigate("/projects")}
        onOpenTasks={() => navigate(`/projects/${project.id}/tasks`)}
        project={project}
      />
      <div className="space-y-6">
        <TaskToolbar onCreate={openCreate} projectId={projectId} />
        <TaskList
          onCreateTask={openCreate}
          onDeleteTask={openTask}
          onEditTask={openEdit}
          onOpenTask={openTask}
          projectId={projectId}
        />
      </div>
      <TaskModal
        onClose={closeModal}
        onEdit={editFromDetails}
        taskId={taskId}
      />
      <CreateTaskModal
        isOpen={searchParams.get("modal") === "create"}
        onClose={closeModal}
        projectId={projectId}
      />
      <EditTaskModal onClose={closeModal} task={editTask} />
    </main>
  );
}
