export interface ParsedResponse {
  statusCode : number;
  statusText : string;
  headers : Record<string, string>;
  bodyStart : string;
}
