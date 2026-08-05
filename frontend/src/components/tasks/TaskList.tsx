import { AlertCircle, Edit3, SearchX, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useTasks } from "../../hooks/tasks/useTasks";
import { useUpdateTaskStatus } from "../../hooks/tasks/useUpdateTaskStatus";
import {
  TaskStatus,
  type Task,
  type TaskFilters,
  type TaskPriority,
} from "../../types/task";
import { getApiErrorMessage } from "../../utils/apiError";
import { EmptyState } from "../common/EmptyState";
import { Button } from "../ui/Button";
import { EmptyTasks } from "./EmptyTasks";
import { LoadingTasks } from "./LoadingTasks";
import { TaskRow } from "./TaskRow";

function TaskListItem({
  onDeleteTask,
  onEditTask,
  onOpenTask,
  task,
}: {
  onDeleteTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onOpenTask: (task: Task) => void;
  task: Task;
}) {
  const updateStatus = useUpdateTaskStatus(task.id, task.projectId);
  return (
    <TaskRow
      actions={
        <>
          <select
            aria-label={`Change status for ${task.title}`}
            className="min-h-9 rounded-lg border border-border bg-app px-2 text-xs text-text"
            disabled={updateStatus.isPending}
            onChange={(event) =>
              updateStatus.mutate(event.target.value as TaskStatus)
            }
            onClick={(event) => event.stopPropagation()}
            value={task.status}
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
          <Button
            aria-label={`Edit ${task.title}`}
            className="size-9 min-h-0 p-0"
            onClick={(event) => {
              event.stopPropagation();
              onEditTask(task);
            }}
            variant="ghost"
          >
            <Edit3 aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={`Delete ${task.title}`}
            className="size-9 min-h-0 p-0"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteTask(task);
            }}
            variant="ghost"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </Button>
        </>
      }
      onClick={onOpenTask}
      task={task}
    />
  );
}

type TaskListProps = {
  onCreateTask: () => void;
  onDeleteTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onOpenTask: (task: Task) => void;
  projectId: string;
};

export function TaskList({
  onCreateTask,
  onDeleteTask,
  onEditTask,
  onOpenTask,
  projectId,
}: TaskListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);
  const filters: TaskFilters = {
    assigneeId: searchParams.get("assigneeId") ?? undefined,
    labelId: searchParams.get("labelId") ?? undefined,
    limit,
    order: searchParams.get("order") === "asc" ? "asc" : "desc",
    page,
    priority: searchParams.get("priority") as TaskPriority | undefined,
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? "updatedAt",
    status: searchParams.get("status") as TaskStatus | undefined,
  };
  const { data, error, isError, isLoading, refetch } = useTasks(
    projectId,
    filters,
  );
  useEffect(() => {
    if (isError)
      toast.error(
        getApiErrorMessage(error, "Unable to load tasks. Please try again."),
      );
  }, [error, isError]);
  const setPage = (nextPage: number) =>
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("page", String(nextPage));
      return next;
    });
  const activeFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.priority ||
    filters.assigneeId ||
    filters.labelId,
  );
  return (
    <section>
      {isLoading ? (
        <LoadingTasks variant="rows" />
      ) : isError ? (
        <EmptyState
          action={<Button onClick={() => void refetch()}>Try again</Button>}
          description={getApiErrorMessage(
            error,
            "We couldn’t load tasks. Please try again.",
          )}
          icon={AlertCircle}
          title="Tasks unavailable"
        />
      ) : !data?.tasks.length ? (
        activeFilters ? (
          <EmptyState
            action={
              <Button onClick={() => setSearchParams({})}>Clear filters</Button>
            }
            description="Try changing or clearing your filters to find tasks."
            icon={SearchX}
            title="No matching tasks"
          />
        ) : (
          <EmptyTasks onCreate={onCreateTask} />
        )
      ) : (
        <>
          <div className="rounded-xl border border-border-subtle bg-elevated">
            <div className="divide-y divide-border">
              {data.tasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                  onOpenTask={onOpenTask}
                  task={task}
                />
              ))}
            </div>
          </div>
          {data.pagination.totalPages > 1 && (
            <nav
              aria-label="Task pagination"
              className="flex items-center justify-between border-t border-border pt-6"
            >
              <p className="text-sm text-muted">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  disabled={!data.pagination.hasPreviousPage}
                  onClick={() => setPage(page - 1)}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  disabled={!data.pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
