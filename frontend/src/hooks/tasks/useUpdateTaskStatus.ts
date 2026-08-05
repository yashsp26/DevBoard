import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { taskService } from "../../services/task.service";
import type { Paginated, Task, TaskStatus } from "../../types/task";
import { getApiErrorMessage } from "../../utils/apiError";
import { toast } from "sonner";
import { taskQueryKeys } from "./taskQueryKeys";

export function useUpdateTaskStatus(taskId: string, projectId?: string) {
  return useMutation({
    mutationFn: (status: TaskStatus) =>
      taskService.updateTaskStatus(taskId, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({
        queryKey: taskQueryKeys.detail(taskId),
      });
      if (projectId)
        await queryClient.cancelQueries({
          queryKey: taskQueryKeys.projectLists(projectId),
        });
      const previousTask = queryClient.getQueryData<Task>(
        taskQueryKeys.detail(taskId),
      );
      const previousLists = projectId
        ? queryClient.getQueriesData<Paginated<Task>>({
            queryKey: taskQueryKeys.projectLists(projectId),
          })
        : [];

      if (previousTask)
        queryClient.setQueryData<Task>(taskQueryKeys.detail(taskId), {
          ...previousTask,
          status,
        });
      if (projectId)
        queryClient.setQueriesData<Paginated<Task>>(
          { queryKey: taskQueryKeys.projectLists(projectId) },
          (page) =>
            page && {
              ...page,
              data: page.tasks.map((task) =>
                task.id === taskId ? { ...task, status } : task,
              ),
            },
        );

      return { previousLists, previousTask };
    },
    onError: (error, _status, context) => {
      if (context?.previousTask)
        queryClient.setQueryData(
          taskQueryKeys.detail(taskId),
          context.previousTask,
        );
      context?.previousLists.forEach(([queryKey, page]) =>
        queryClient.setQueryData(queryKey, page),
      );
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update the task status. Please try again.",
        ),
      );
    },
    onSuccess: (task) => {
      queryClient.setQueryData(taskQueryKeys.detail(taskId), task);
      queryClient.setQueriesData<Paginated<Task>>(
        { queryKey: taskQueryKeys.projectLists(task.projectId) },
        (page) =>
          page && {
            ...page,
            data: page.tasks.map((currentTask) =>
              currentTask.id === taskId ? task : currentTask,
            ),
          },
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.detail(taskId),
        }),
        ...(projectId
          ? [
              queryClient.invalidateQueries({
                queryKey: taskQueryKeys.projectLists(projectId),
              }),
            ]
          : []),
      ]);
    },
  });
}
