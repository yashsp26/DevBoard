import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../lib/queryClient";
import { taskService } from "../../services/task.service";
import type { CreateTaskInput } from "../../types/task";
import { getApiErrorMessage } from "../../utils/apiError";
import { taskQueryKeys } from "./taskQueryKeys";

export function useCreateTask(projectId: string) {
  return useMutation({
    mutationFn: (payload: CreateTaskInput) =>
      taskService.createTask(projectId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: taskQueryKeys.projectLists(projectId),
      });
      toast.success("Task created.");
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to create the task. Please try again.",
        ),
      ),
  });
}
