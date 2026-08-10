/**
 * Convert an absolute temporary file path into the
 * logical DevBoard file path.
 */
function normalizeLocation(line) {
  return line.replace(
    /.*[\\/](index\.js:\d+:\d+)/,
    "at $1"
  );
}

/**
 * Extract a concise error message from Node.js stderr.
 */
export function formatNodeError(stderr, fallbackMessage) {
  if (!stderr) {
    return fallbackMessage;
  }

  const lines = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const errorLine = lines.find(
    (line) =>
      line.startsWith("Error:") ||
      line.startsWith("TypeError:") ||
      line.startsWith("ReferenceError:") ||
      line.startsWith("SyntaxError:") ||
      line.startsWith("RangeError:")
  );

  const stackLine = lines.find((line) =>
    /\d+:\d+\)?$/.test(line)
  );

  const location = stackLine
    ? normalizeLocation(stackLine)
    : null;

  if (errorLine && location) {
    return `${errorLine}\n${location}`;
  }

  return errorLine || fallbackMessage;
}