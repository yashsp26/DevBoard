import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
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

      const files = request.files || [];

      if (!files.length) {
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

      const file = files[0];
      const entryPoint = isTypeScript
        ? (files.length === 1 ? "index.ts" : request.entryPoint)
        : request.entryPoint || file.path;
      // Preserve the original single-file TypeScript contract, which always
      // compiles the submitted source as index.ts regardless of its request path.
      const filesToWrite = isTypeScript && files.length === 1
        ? [{ ...file, path: "index.ts" }]
        : files;

      const resolvedDirectory = path.resolve(temporaryDirectory);

      const resolveProjectPath = (filePath) => {
        if (
          typeof filePath !== "string" ||
          !filePath ||
          filePath.includes("\0") ||
          path.isAbsolute(filePath) ||
          filePath.includes("\\") ||
          filePath.split("/").some((segment) => !segment || segment === "." || segment === "..")
        ) {
          return null;
        }
        const resolvedPath = path.resolve(resolvedDirectory, filePath);
        return resolvedPath.startsWith(resolvedDirectory + path.sep) ? resolvedPath : null;
      };

      const resolvedEntryPath = resolveProjectPath(entryPoint);

      if (!resolvedEntryPath || !filesToWrite.some((item) => item.path === entryPoint)) {
        return createExecutionResult({
          status: EXECUTION_STATUS.FAILED,
          error: {
            message: "Invalid entry point.",
            code: "INVALID_ENTRY_POINT",
          },
          durationMs: Date.now() - startTime,
        });
      }

      for (const sourceFile of filesToWrite) {
        const targetPath = resolveProjectPath(sourceFile.path);
        if (!targetPath) {
          return createExecutionResult({
            status: EXECUTION_STATUS.FAILED,
            error: { message: "Invalid project file path.", code: "INVALID_FILE_PATH" },
            durationMs: Date.now() - startTime,
          });
        }
        await mkdir(path.dirname(targetPath), { recursive: true });
        await writeFile(targetPath, sourceFile.content, "utf8");
      }

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
          // Keep emitted paths aligned with the reconstructed project tree.
          rootDir: temporaryDirectory,
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

        executablePath = path.join(
          temporaryDirectory,
          entryPoint.replace(/\.(?:ts|tsx)$/, ".js"),
        );
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
