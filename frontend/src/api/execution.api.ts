import { apiClient } from "./client";
import type { ExecutionResult, RunCodeRequest, RunProjectRequest } from "../types/execution";

type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export const executionApi = {
  async runCode(payload: RunCodeRequest) {
    const { data } = await apiClient.post<ApiResponse<ExecutionResult>>(
      "/v1/execution/run",
      payload,
    );
    return data.data;
  },
  async runProject(projectId: string, payload: RunProjectRequest) {
    const { data } = await apiClient.post<ApiResponse<ExecutionResult>>(
      `/v1/execution/projects/${projectId}/run`,
      payload,
    );
    return data.data;
  },
};
