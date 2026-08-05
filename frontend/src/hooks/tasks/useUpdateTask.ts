import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../lib/queryClient";
import { taskService } from "../../services/task.service";
import type { UpdateTaskInput } from "../../types/task";
import { getApiErrorMessage } from "../../utils/apiError";
import { taskQueryKeys } from "./taskQueryKeys";

export function useUpdateTask(taskId: string) {
  return useMutation({
    mutationFn: (payload: UpdateTaskInput) =>
      taskService.updateTask(taskId, payload),
    onSuccess: async (task) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.projectLists(task.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(taskId),
        }),
      ]);
      toast.success("Task updated.");
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update the task. Please try again.",
        ),
      ),
  });
}
