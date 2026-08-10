import { AlertCircle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { ExecutionPanelState } from "../../types/execution";
import { ActionIconButton } from "../common/ActionIconButton";
import { Badge } from "../ui/Badge";

type ExecutionOutputProps = {
  state: Exclude<ExecutionPanelState, { status: "idle" }>;
  onClose: () => void;
};

const statusDetails = {
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const },
  failed: { label: "Failed", icon: XCircle, variant: "danger" as const },
  timeout: { label: "Timed out", icon: Clock3, variant: "warning" as const },
  running: { label: "Running", icon: Clock3, variant: "info" as const },
  "api-error": { label: "Unavailable", icon: AlertCircle, variant: "danger" as const },
};

function ConsoleText({ children }: { children: string }) {
  return (
    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-app p-3 font-mono text-xs leading-5 text-text">
      {children}
    </pre>
  );
}

export function ExecutionOutput({ onClose, state }: ExecutionOutputProps) {
  const details = statusDetails[state.status];
  const Icon = details.icon;
  const result = "result" in state ? state.result : undefined;
  const message =
    state.status === "api-error"
      ? state.message
      : result?.error?.message || result?.stderr;

  return (
    <section
      aria-live="polite"
      className="rounded-xl border border-border bg-elevated p-4"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon aria-hidden="true" className="size-5 text-muted" />
          <h3 className="font-semibold text-text">Execution</h3>
          <Badge variant={details.variant}>{details.label}</Badge>
        </div>
        <ActionIconButton
          aria-label="Close execution output"
          icon={XCircle}
          onClick={onClose}
        />
      </header>

      <div className="mt-4 space-y-3">
        {state.status === "running" ? (
          <p className="text-sm text-muted">Running your code...</p>
        ) : state.status === "completed" ? (
          <div>
            <p className="mb-2 text-sm font-medium text-text">Output</p>
            <ConsoleText>{result?.stdout.trim() || "No output."}</ConsoleText>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-sm font-medium text-danger">
              {state.status === "timeout" ? "Execution timed out" : "Execution failed"}
            </p>
            {message && <ConsoleText>{message}</ConsoleText>}
            {result?.stdout && (
              <div className="mt-3">
                <p className="mb-2 text-sm font-medium text-text">Output</p>
                <ConsoleText>{result.stdout}</ConsoleText>
              </div>
            )}
          </div>
        )}

        {result && (
          <dl className="grid gap-2 border-t border-border pt-3 text-xs text-muted sm:grid-cols-2">
            <div className="flex justify-between gap-3 sm:block">
              <dt>Exit code</dt>
              <dd className="font-medium text-text">
                {result.exitCode ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt>Duration</dt>
              <dd className="font-medium text-text">{result.durationMs}ms</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
}
