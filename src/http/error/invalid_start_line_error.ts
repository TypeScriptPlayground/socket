export class InvalidStartLineError extends Error {
  content : string;
  constructor(content : string) {
    super(`Invalid HTTP status. Trying to parse: "${content}"`);
    this.content = content;
  }
}
