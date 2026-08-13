import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Play,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";

import type { ExecutionPanelState } from "../../types/execution";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type ExecutionOutputProps = {
  state: ExecutionPanelState;
  isRunning: boolean;
  onRun: () => void;
};

const statusDetails = {
  idle: {
    label: "Ready",
    icon: Play,
    variant: "default" as const,
  },

  completed: {
    label: "Completed",
    icon: CheckCircle2,
    variant: "success" as const,
  },

  failed: {
    label: "Failed",
    icon: XCircle,
    variant: "danger" as const,
  },

  timeout: {
    label: "Timed out",
    icon: Clock3,
    variant: "warning" as const,
  },

  running: {
    label: "Running",
    icon: Clock3,
    variant: "info" as const,
  },

  "api-error": {
    label: "Unavailable",
    icon: AlertCircle,
    variant: "danger" as const,
  },
};

function ConsoleText({
  children,
}: {
  children: string;
}) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-words rounded-lg border border-border bg-app px-4 py-3 font-mono text-xs leading-5 text-text">
      {children}
    </pre>
  );
}

function IconButton({
  label,
  title,
  onClick,
  children,
}: {
  label: string;
  title?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-app hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
      onClick={onClick}
      title={title ?? label}
      type="button"
    >
      {children}
    </button>
  );
}

export function ExecutionOutput({
  state,
  isRunning,
  onRun,
}: ExecutionOutputProps) {
  const details = statusDetails[state.status];
  // const Icon = details.icon;

  const result =
    "result" in state ? state.result : undefined;

  const message =
    state.status === "api-error"
      ? state.message
      : result?.error?.message || result?.stderr;

  const copyOutput = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard may be unavailable in some browser contexts.
    }
  };

  return (
    <section className="flex min-h-0 min-w-0 flex-col bg-elevated">
      {/* ------------------------------------------------------- */}
      {/* Execution header */}
      {/* ------------------------------------------------------- */}

      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Play
            aria-hidden="true"
            className="size-5 text-text"
          />

          <h2 className="text-lg font-semibold text-text">
            Execution
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={isRunning}
            isLoading={isRunning}
            onClick={onRun}
            type="button"
          >
            {!isRunning && (
              <Play
                aria-hidden="true"
                className="size-4"
              />
            )}

            {isRunning ? "Running..." : "Run"}
          </Button>

          <IconButton
            label="Execution settings"
            title="Execution settings"
          >
            <Settings className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* Execution body */}
      {/* ------------------------------------------------------- */}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {/* --------------------------------------------------- */}
        {/* Status */}
        {/* --------------------------------------------------- */}

        {state.status !== "idle" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={details.variant}>
                {details.label}
              </Badge>

              {result?.durationMs != null && (
                <span className="text-xs text-muted">
                  {result.durationMs}ms
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">
                Today, 11:42 AM
              </span>

              <IconButton
                label="Delete execution"
                title="Delete execution"
              >
                <Trash2 className="size-4" />
              </IconButton>
            </div>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* Idle */}
        {/* --------------------------------------------------- */}

        {state.status === "idle" && (
          <div className="flex min-h-60 items-center justify-center rounded-lg border border-border bg-app px-6 text-center">
            <div>
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-elevated">
                <Play className="size-5 text-muted" />
              </div>

              <p className="text-sm font-medium text-text">
                Run your code to see the output
              </p>

              <p className="mt-1 text-xs text-muted">
                Execution results will appear here.
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* Running */}
        {/* --------------------------------------------------- */}

        {state.status === "running" && (
          <div className="flex min-h-60 items-center justify-center rounded-lg border border-border bg-app">
            <div className="text-center">
              <Clock3 className="mx-auto mb-3 size-6 animate-pulse text-muted" />

              <p className="text-sm font-medium text-text">
                Running your code...
              </p>

              <p className="mt-1 text-xs text-muted">
                Please wait for the execution to finish.
              </p>
            </div>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* Error */}
        {/* --------------------------------------------------- */}

        {(state.status === "failed" ||
          state.status === "timeout" ||
          state.status === "api-error") && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-danger">
                {state.status === "timeout"
                  ? "Execution timed out"
                  : "Error"}
              </p>

              {message && (
                <IconButton
                  label="Copy error"
                  title="Copy error"
                  onClick={() =>
                    copyOutput(message)
                  }
                >
                  <Copy className="size-4" />
                </IconButton>
              )}
            </div>

            {message && (
              <ConsoleText>{message}</ConsoleText>
            )}
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* Completed output */}
        {/* --------------------------------------------------- */}

        {state.status === "completed" && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-text">
                Output
              </p>

              {result?.stdout && (
                <IconButton
                  label="Copy output"
                  title="Copy output"
                  onClick={() =>
                    copyOutput(result.stdout)
                  }
                >
                  <Copy className="size-4" />
                </IconButton>
              )}
            </div>

            <ConsoleText>
              {result?.stdout?.trim() || "No output."}
            </ConsoleText>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* Failed output */}
        {/* --------------------------------------------------- */}

        {(state.status === "failed" ||
          state.status === "timeout" ||
          state.status === "api-error") &&
          result?.stdout && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-text">
                  Output
                </p>

                <IconButton
                  label="Copy output"
                  title="Copy output"
                  onClick={() =>
                    copyOutput(result.stdout)
                  }
                >
                  <Copy className="size-4" />
                </IconButton>
              </div>

              <ConsoleText>
                {result.stdout}
              </ConsoleText>
            </div>
          )}

        {/* --------------------------------------------------- */}
        {/* Execution metadata */}
        {/* --------------------------------------------------- */}

        {result && (
          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="rounded-lg bg-app px-4 py-3">
              <dt className="text-xs text-muted">
                Exit code
              </dt>

              <dd className="mt-1 text-sm font-semibold text-text">
                {result.exitCode ?? "-"}
              </dd>
            </div>

            <div className="rounded-lg bg-app px-4 py-3">
              <dt className="text-xs text-muted">
                Duration
              </dt>

              <dd className="mt-1 text-sm font-semibold text-text">
                {result.durationMs}ms
              </dd>
            </div>
          </dl>
        )}

        {/* --------------------------------------------------- */}
        {/* Input */}
        {/* --------------------------------------------------- */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-text">
              Input (stdin)
            </p>

            <IconButton
              label="Copy stdin"
              title="Copy stdin"
              onClick={() => copyOutput("")}
            >
              <Copy className="size-4" />
            </IconButton>
          </div>

          <ConsoleText>-</ConsoleText>
        </div>

        {/* --------------------------------------------------- */}
        {/* Run history */}
        {/* --------------------------------------------------- */}

        <div className="mt-5 rounded-lg border border-border bg-app">
          <button
            className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-elevated focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="button"
          >
            <div className="flex items-center gap-3">
              <Clock3 className="size-4 text-muted" />

              <p className="text-sm font-medium text-text">
                Run history
              </p>

              <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted">
                3
              </span>
            </div>

            <ChevronRight className="size-4 text-muted" />
          </button>
        </div>
      </div>
    </section>
  );
}