export class MalformedChunkedEncodingError extends Error {
  constructor(message : string) {
    super(`Malformed chunked encoding: ${message}`);
  }
}
