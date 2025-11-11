export class InvalidResponseError extends Error {
  constructor() {
    super('Invalid response. Did not find header end.');
  }
}
