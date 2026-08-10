import { NodeRunner } from "./runners/node.runner.js";
import {
  createExecutionRequest,
} from "./execution.types.js";

const runners = [
  new NodeRunner(),
];

function findRunner(request) {
  return runners.find((runner) => runner.canRun(request));
}

export async function executeCode(input) {
  const request = createExecutionRequest(input);

  const runner = findRunner(request);

  if (!runner) {
    throw new Error(
      `No execution runner available for language: ${request.language}`
    );
  }

  return runner.run(request);
}