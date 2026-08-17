import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";

import { executeCode } from "./execution.service.js";

const SUPPORTED_LANGUAGES = new Set(["javascript", "typescript"]);
const DEFAULT_ENTRY_POINTS = [
  "src/index.ts",
  "src/server.ts",
  "index.ts",
  "server.ts",
  "src/index.js",
  "src/server.js",
  "index.js",
  "server.js",
];

function isSafeProjectPath(filePath) {
  if (typeof filePath !== "string" || !filePath || filePath.includes("\0")) {
    return false;
  }

  return !(
    filePath.startsWith("/") ||
    filePath.startsWith("\\") ||
    /^[a-zA-Z]:/.test(filePath) ||
    filePath.includes("\\") ||
    filePath.split("/").some((segment) => !segment || segment === "." || segment === "..")
  );
}

function selectEntryPoint(files, suppliedEntryPoint) {
  if (suppliedEntryPoint !== undefined) {
    if (!isSafeProjectPath(suppliedEntryPoint)) {
      throw new ApiError(400, "Entry point must be a safe relative project path.");
    }

    if (!files.some((file) => file.path === suppliedEntryPoint)) {
      throw new ApiError(400, "Entry point does not exist in this project.");
    }

    return suppliedEntryPoint;
  }

  const defaultEntryPoint = DEFAULT_ENTRY_POINTS.find((candidate) =>
    files.some((file) => file.path === candidate),
  );

  if (!defaultEntryPoint) {
    throw new ApiError(400, "No default entry point was found. Provide an entryPoint.");
  }

  return defaultEntryPoint;
}

export async function executeProject(userId, projectId, options) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const snippets = await prisma.snippet.findMany({
    where: { projectId: project.id, userId },
    select: { filePath: true, code: true, language: true },
  });

  if (!snippets.length) {
    throw new ApiError(400, "This project has no files to execute.");
  }

  const paths = new Set();
  for (const snippet of snippets) {
    if (!isSafeProjectPath(snippet.filePath)) {
      throw new ApiError(400, "Every project file must have a valid relative file path.");
    }

    if (paths.has(snippet.filePath)) {
      throw new ApiError(400, "Project file paths must be unique.");
    }
    paths.add(snippet.filePath);

    if (!SUPPORTED_LANGUAGES.has(snippet.language)) {
      throw new ApiError(400, "Project execution supports only JavaScript or TypeScript files.");
    }
  }

  const languages = new Set(snippets.map((snippet) => snippet.language));
  if (languages.size !== 1) {
    throw new ApiError(400, "Project files must use one execution language.");
  }

  const files = snippets.map((snippet) => ({
    path: snippet.filePath,
    content: snippet.code,
  }));

  return executeCode({
    language: snippets[0].language,
    framework: "node",
    entryPoint: selectEntryPoint(files, options.entryPoint),
    files,
    stdin: options.stdin,
    timeoutMs: options.timeoutMs,
  });
}
