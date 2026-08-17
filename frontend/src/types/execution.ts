import type { SnippetLanguage } from "../features/snippets/languages";

export type ExecutionStatus = "completed" | "failed" | "timeout";

export type ExecutionLanguage = Extract<
  SnippetLanguage,
  "javascript" | "typescript"
>;

export type ExecutionFile = {
  path: string;
  content: string;
};

export type RunCodeRequest = {
  language: ExecutionLanguage;
  framework?: string;
  entryPoint: string;
  files: ExecutionFile[];
  stdin?: string;
  timeoutMs?: number;
};

export type RunProjectRequest = {
  entryPoint?: string;
  stdin?: string;
  timeoutMs?: number;
};

export type ExecutionError = {
  message: string;
  code: string | number | null;
};

export type ExecutionResult = {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  error: ExecutionError | null;
};

export type ExecutionPanelState =
  | { status: "idle" }
  | { status: "running" }
  | { status: ExecutionStatus; result: ExecutionResult }
  | { status: "api-error"; message: string };
