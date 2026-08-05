import { apiClient } from "../api/client";
import type {
  CreateTaskInput,
  Paginated,
  Task,
  TaskFilters,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

type ApiResponse<TData> = {
  data: TData;
  message: string;
  success: boolean;
};

export const taskService = {
  async createTask(projectId: string, payload: CreateTaskInput) {
    const { data } = await apiClient.post<ApiResponse<Task>>(
      `/v1/projects/${projectId}/tasks`,
      payload,
    );
    return data.data;
  },

  async getTasks(projectId: string, filters: TaskFilters = {}) {
    const { data } = await apiClient.get<ApiResponse<Paginated<Task>>>(
      `/v1/projects/${projectId}/tasks`,
      { params: filters },
    );
    return data.data;
  },

  async getTask(taskId: string) {
    const { data } = await apiClient.get<ApiResponse<Task>>(
      `/v1/tasks/${taskId}`,
    );
    return data.data;
  },

  async updateTask(taskId: string, payload: UpdateTaskInput) {
    const { data } = await apiClient.patch<ApiResponse<Task>>(
      `/v1/tasks/${taskId}`,
      payload,
    );
    return data.data;
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const { data } = await apiClient.patch<ApiResponse<Task>>(
      `/v1/tasks/${taskId}/status`,
      { status },
    );
    return data.data;
  },

  async deleteTask(taskId: string) {
    await apiClient.delete(`/v1/tasks/${taskId}`);
  },
};
