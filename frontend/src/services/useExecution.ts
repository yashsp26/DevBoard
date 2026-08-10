import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { executionApi } from "../api/execution.api";
import type { ExecutionPanelState, RunCodeRequest } from "../types/execution";
import { getApiErrorMessage } from "../utils/apiError";

export function useRunExecution() {
  const [state, setState] = useState<ExecutionPanelState>({ status: "idle" });
  const mutation = useMutation({
    mutationFn: executionApi.runCode,
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
    run: (request: RunCodeRequest) => mutation.mutate(request),
    state,
    clear: () => setState({ status: "idle" }),
  };
}
