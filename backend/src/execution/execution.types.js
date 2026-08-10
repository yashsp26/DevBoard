/**
 * Supported execution languages.
 *
 * Keep this list extensible. We will add Python, Java and C#
 * when their runners are implemented.
 */
export const EXECUTION_LANGUAGES = Object.freeze({
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  PYTHON: 'python',
  JAVA: 'java',
  CSHARP: 'csharp',
});

/**
 * Supported execution frameworks.
 *
 * Framework support will be added incrementally.
 */
export const EXECUTION_FRAMEWORKS = Object.freeze({
  NODE: 'node',
  REACT: 'react',
  NEXTJS: 'nextjs',
  DJANGO: 'django',
  SPRING: 'spring',
  DOTNET: 'dotnet',
});

/**
 * Execution status.
 */
export const EXECUTION_STATUS = Object.freeze({
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  TIMEOUT: 'timeout',
});

/**
 * Creates the standard shape of an execution request.
 *
 * This is intentionally independent from Prisma/database models.
 */
export function createExecutionRequest({
  language,
  framework = null,
  entryPoint = null,
  files = [],
  stdin = '',
  timeoutMs = 10000,
}) {
  return {
    language,
    framework,
    entryPoint,
    files,
    stdin,
    timeoutMs,
  };
}

/**
 * Creates the standard shape returned by every runner.
 *
 * All future runners should return this same structure.
 */
export function createExecutionResult({
  status,
  stdout = '',
  stderr = '',
  exitCode = null,
  durationMs = 0,
  error = null,
}) {
  return {
    status,
    stdout,
    stderr,
    exitCode,
    durationMs,
    error,
  };
}