import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  mkdtemp,
  writeFile,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

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
      request?.language === EXECUTION_LANGUAGES.JAVASCRIPT &&
      (!request.framework ||
        request.framework === "node")
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
      temporaryDirectory = await mkdtemp(
        path.join(tmpdir(), "devboard-run-")
      );

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

      /*
       * Use the actual file path supplied by the request.
       */
      const entryPoint =
        request.entryPoint || file.path;

      const entryPath = path.join(
        temporaryDirectory,
        entryPoint
      );

      /*
       * Prevent paths such as:
       *
       * ../../some-file
       *
       * from escaping the temporary directory.
       */
      const resolvedEntryPath =
        path.resolve(entryPath);

      const resolvedDirectory =
        path.resolve(temporaryDirectory);

      if (
        !resolvedEntryPath.startsWith(
          resolvedDirectory + path.sep
        )
      ) {
        return createExecutionResult({
          status: EXECUTION_STATUS.FAILED,
          error: {
            message: "Invalid entry point.",
            code: "INVALID_ENTRY_POINT",
          },
          durationMs: Date.now() - startTime,
        });
      }

      await writeFile(
        resolvedEntryPath,
        file.content,
        "utf8"
      );

      /*
       * Execute the file using the same Node.js
       * executable running DevBoard.
       */
      const { stdout, stderr } =
        await execFileAsync(
          process.execPath,
          [resolvedEntryPath],
          {
            cwd: temporaryDirectory,

            timeout:
              request.timeoutMs || 10000,

            maxBuffer:
              1024 * 1024,

            windowsHide: true,
          }
        );

      return createExecutionResult({
        status: EXECUTION_STATUS.COMPLETED,

        stdout,

        stderr,

        exitCode: 0,

        durationMs:
          Date.now() - startTime,
      });
    } catch (error) {
      const timedOut =
        error?.code === "ETIMEDOUT" ||
        error?.killed === true;

      /*
       * Timeout
       */
      if (timedOut) {
        return createExecutionResult({
          status: EXECUTION_STATUS.TIMEOUT,

          stdout:
            error?.stdout || "",

          stderr: "",

          exitCode: null,

          durationMs:
            Date.now() - startTime,

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
      const conciseError =
        formatNodeError(
          error?.stderr,
          "Execution failed."
        );

      return createExecutionResult({
        status: EXECUTION_STATUS.FAILED,

        stdout:
          error?.stdout || "",

        stderr: conciseError,

        exitCode:
          typeof error?.code === "number"
            ? error.code
            : null,

        durationMs:
          Date.now() - startTime,

        error: {
          message: conciseError,

          code:
            typeof error?.code === "number"
              ? error.code
              : "EXECUTION_ERROR",
        },
      });
    } finally {
      /*
       * Always remove the temporary execution directory.
       */
      if (temporaryDirectory) {
        await rm(
          temporaryDirectory,
          {
            recursive: true,
            force: true,
          }
        );
      }
    }
  }
}