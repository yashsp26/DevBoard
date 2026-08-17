import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { executionApi } from "../api/execution.api";
import type {
  ExecutionPanelState,
  RunCodeRequest,
  RunProjectRequest,
} from "../types/execution";
import { getApiErrorMessage } from "../utils/apiError";

export function useRunExecution() {
  const [state, setState] = useState<ExecutionPanelState>({ status: "idle" });
  const mutation = useMutation({
    mutationFn: ({
      mode,
      projectId,
      request,
    }: {
      mode: "standalone" | "project";
      projectId?: string;
      request: RunCodeRequest | RunProjectRequest;
    }) => {
      if (mode === "project") {
        return executionApi.runProject(projectId!, request as RunProjectRequest);
      }

      return executionApi.runCode(request as RunCodeRequest);
    },
    onMutate: () => setState({ status: "running" }),
    onSuccess: (result) => setState({ status: result.status, result }),
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to run the code. Please try again.",
      );
      setState({ status: "api-error", message });
      toast.error(message);
    },
  });

  return {
    isRunning: mutation.isPending,
    runStandalone: (request: RunCodeRequest) =>
      mutation.mutate({ mode: "standalone", request }),
    runProject: (projectId: string, request: RunProjectRequest) =>
      mutation.mutate({ mode: "project", projectId, request }),
    state,
    clear: () => setState({ status: "idle" }),
  };
}
