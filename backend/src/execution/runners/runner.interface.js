/**
 * Base runner contract.
 *
 * JavaScript does not have interfaces like TypeScript,
 * so we enforce the contract at runtime.
 */
export class Runner {
  /**
   * Returns true if this runner can execute the request.
   *
   * @param {object} request
   * @returns {boolean}
   */
  canRun(request) {
    throw new Error('canRun() must be implemented by the runner');
  }

  /**
   * Execute the provided code/project.
   *
   * @param {object} request
   * @returns {Promise<object>}
   */
  async run(request) {
    throw new Error('run() must be implemented by the runner');
  }
}