import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";

import { Runner } from "./runner.interface.js";

import {
  EXECUTION_LANGUAGES,
  EXECUTION_STATUS,
  createExecutionResult,
} from "../execution.types.js";

import { formatNodeError } from "../execution.error.js";

const execFileAsync = promisify(execFile);

export class NodeRunner extends Runner {
  canRun(request) {
    return (
      [
        EXECUTION_LANGUAGES.JAVASCRIPT,
        EXECUTION_LANGUAGES.TYPESCRIPT,
      ].includes(request?.language) &&
      (!request.framework || request.framework === "node")
    );
  }

  async run(request) {
    const startTime = Date.now();

    let temporaryDirectory = null;

    try {
      /*
       * Create an isolated temporary directory
       * for this execution.
       */
      temporaryDirectory = await mkdtemp(path.join(tmpdir(), "DevLupo-run-"));

      /*
       * Phase 1 supports exactly one file.
       */
      const file = request.files?.[0];

      if (!file) {
        return createExecutionResult({
          status: EXECUTION_STATUS.FAILED,
          error: {
            message: "No source file was provided.",
            code: "NO_FILE",
          },
          durationMs: Date.now() - startTime,
        });
      }

      const isTypeScript = request.language === EXECUTION_LANGUAGES.TYPESCRIPT;

      /*
       * TypeScript always starts as index.ts and emits index.js. JavaScript
       * retains the existing request-controlled entry point behavior.
       */
      const entryPoint = isTypeScript
        ? "index.ts"
        : request.entryPoint || file.path;

      const entryPath = path.join(temporaryDirectory, entryPoint);

      /*
       * Prevent paths such as:
       *
       * ../../some-file
       *
       * from escaping the temporary directory.
       */
      const resolvedEntryPath = path.resolve(entryPath);

      const resolvedDirectory = path.resolve(temporaryDirectory);

      if (!resolvedEntryPath.startsWith(resolvedDirectory + path.sep)) {
        return createExecutionResult({
          status: EXECUTION_STATUS.FAILED,
          error: {
            message: "Invalid entry point.",
            code: "INVALID_ENTRY_POINT",
          },
          durationMs: Date.now() - startTime,
        });
      }

      await writeFile(resolvedEntryPath, file.content, "utf8");

      let executablePath = resolvedEntryPath;

      if (isTypeScript) {
        /*
         * NodeNext uses the nearest package type to determine the emitted
         * module format. Keep the generated JavaScript ESM-compatible with
         * this backend and the existing Node execution path.
         */
        await writeFile(
          path.join(temporaryDirectory, "package.json"),
          JSON.stringify({ type: "module" }),
          "utf8",
        );

        const compilerOptions = {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.NodeNext,
          moduleResolution: ts.ModuleResolutionKind.NodeNext,
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true,
          sourceMap: false,
          noEmitOnError: true,
          outDir: temporaryDirectory,
        };
        const program = ts.createProgram([resolvedEntryPath], compilerOptions);
        const diagnostics = ts.getPreEmitDiagnostics(program);

        if (diagnostics.length > 0) {
          const diagnostic = formatTypeScriptDiagnostic(diagnostics[0]);

          return createExecutionResult({
            status: EXECUTION_STATUS.FAILED,
            stderr: `TypeScript compilation failed\n\n${diagnostic}`,
            durationMs: Date.now() - startTime,
            error: {
              message: `TypeScript compilation failed: ${diagnostic}`,
              code: null,
            },
          });
        }

        const emitResult = program.emit();
        const emitDiagnostic = emitResult.diagnostics[0];

        if (emitDiagnostic) {
          const diagnostic = formatTypeScriptDiagnostic(emitDiagnostic);

          return createExecutionResult({
            status: EXECUTION_STATUS.FAILED,
            stderr: `TypeScript compilation failed\n\n${diagnostic}`,
            durationMs: Date.now() - startTime,
            error: {
              message: `TypeScript compilation failed: ${diagnostic}`,
              code: null,
            },
          });
        }

        executablePath = path.join(temporaryDirectory, "index.js");
      }

      /*
       * Execute the file using the same Node.js
       * executable running DevLupo.
       */
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        [executablePath],
        {
          cwd: temporaryDirectory,

          timeout: request.timeoutMs || 10000,

          maxBuffer: 1024 * 1024,

          windowsHide: true,
        },
      );

      return createExecutionResult({
        status: EXECUTION_STATUS.COMPLETED,

        stdout,

        stderr,

        exitCode: 0,

        durationMs: Date.now() - startTime,
      });
    } catch (error) {
      const timedOut = error?.code === "ETIMEDOUT" || error?.killed === true;

      /*
       * Timeout
       */
      if (timedOut) {
        return createExecutionResult({
          status: EXECUTION_STATUS.TIMEOUT,

          stdout: error?.stdout || "",

          stderr: "",

          exitCode: null,

          durationMs: Date.now() - startTime,

          error: {
            message: `Execution timed out after ${
              request.timeoutMs || 10000
            }ms.`,

            code: "TIMEOUT",
          },
        });
      }

      /*
       * Runtime / syntax / compilation-style error
       */
      const conciseError = formatNodeError(error?.stderr, "Execution failed.");

      return createExecutionResult({
        status: EXECUTION_STATUS.FAILED,

        stdout: error?.stdout || "",

        stderr: conciseError,

        exitCode: typeof error?.code === "number" ? error.code : null,

        durationMs: Date.now() - startTime,

        error: {
          message: conciseError,

          code:
            typeof error?.code === "number" ? error.code : "EXECUTION_ERROR",
        },
      });
    } finally {
      /*
       * Always remove the temporary execution directory.
       */
      if (temporaryDirectory) {
        await rm(temporaryDirectory, {
          recursive: true,
          force: true,
        });
      }
    }
  }
}

function formatTypeScriptDiagnostic(diagnostic) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");

  if (!diagnostic.file || diagnostic.start === undefined) {
    return message;
  }

  const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

  return `${path.basename(diagnostic.file.fileName)}:${position.line + 1}:${
    position.character + 1
  }\n${message}`;
}
