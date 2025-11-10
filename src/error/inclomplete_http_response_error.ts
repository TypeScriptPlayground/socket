/**
 * This error represents an incomplete HTTP response.
 */
export class IncompleteHttpResponseError extends Error {
  constructor() {
    super('Incomplete HTTP response');
  }
}
