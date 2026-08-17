import { CalendarDays } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";
import type { Task } from "../../types/task";
import { TaskLabel } from "./TaskLabel";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";

export interface TaskCardProps {
  onClick?: (task: Task) => void;
  task: Task;
}
const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );

export function TaskCard({ onClick, task }: TaskCardProps) {
  const isInteractive = Boolean(onClick);
  const openTask = () => onClick?.(task);
  return (
    <Card
      aria-label={isInteractive ? `Open task ${task.title}` : undefined}
      className={cn(
        "flex min-h-64 flex-col p-5",
        isInteractive &&
          "cursor-pointer transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-(--shadow-elevation-3) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      )}
      onClick={openTask}
      onKeyDown={(event) => {
        if (isInteractive && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          openTask();
        }
      }}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <header className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-text">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {task.assignee?.name ?? "Unassigned"}
          </p>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </header>
      <div className="mt-5 flex-1">
        <p className="line-clamp-3 min-h-15 text-sm leading-6 text-muted">
          {task.description || "No description added."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <TaskStatusBadge status={task.status} />
          {task.labels.map((label) => (
            <TaskLabel key={label.id} label={label} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-app p-3 text-sm text-muted">
          <span className="inline-flex min-w-0 items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
            {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Avatar
              alt={
                task.assignee ? `${task.assignee.name}'s avatar` : "Unassigned"
              }
              size="sm"
            />
            <span className="max-w-24 truncate">
              {task.assignee?.name ?? "Unassigned"}
            </span>
          </span>
        </div>
      </div>
      <footer className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted">
          Updated {formatDate(task.updatedAt)}
        </span>
        <TaskStatusBadge status={task.status} />
      </footer>
    </Card>
  );
}
