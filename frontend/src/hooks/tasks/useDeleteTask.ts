import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../lib/queryClient";
import { taskService } from "../../services/task.service";
import type { Paginated, Task } from "../../types/task";
import { getApiErrorMessage } from "../../utils/apiError";
import { taskQueryKeys } from "./taskQueryKeys";

export function useDeleteTask(task: Task) {
  const { id: taskId, projectId } = task;
  return useMutation({
    mutationFn: () => taskService.deleteTask(taskId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: taskQueryKeys.detail(taskId) });
      queryClient.setQueriesData<Paginated<Task>>(
        { queryKey: taskQueryKeys.projectLists(projectId) },
        (page) =>
          page && {
            ...page,
            data: page.tasks.filter((currentTask) => currentTask.id !== taskId),
          },
      );
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.projectLists(projectId),
      });
      toast.success("Task deleted.");
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete the task. Please try again.",
        ),
      ),
  });
}
