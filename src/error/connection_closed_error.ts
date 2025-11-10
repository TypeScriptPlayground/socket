/**
 * This error represents a connection that was closed before receiving a response.
 */
export class ConnectionClosedError extends Error {
  constructor() {
    super('Connection closed before receiving response')
  }
}
