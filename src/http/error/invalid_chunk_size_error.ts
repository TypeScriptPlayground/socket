export class InvalidChunkSizeError extends Error {
  constructor() {
    super(`Invalid chunk size`);
  }
}
