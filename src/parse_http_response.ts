import { ParsedResponse } from './parsed_response.ts';
import * as error from './error/index.ts'

/**
 * This function parses an HTTP response.
 * 
 * @param data Data to parse
 * @throws `IncompleteHttpResponseError` if the response is incomplete
 * @throws `InvalidHttpResponseError` if the response is invalid
 * @returns The parsed response.
 */
export function parseHttpResponse(data : string) : ParsedResponse {
  Deno.writeTextFileSync('response.txt', data);
  
  const headerEnd = data.indexOf("\r\n\r\n");

  if (headerEnd === -1) {
    throw new error.IncompleteHttpResponseError();
  }

  const headerSection = data.slice(0, headerEnd);
  const bodyStart = data.slice(headerEnd + 4);
  
  const lines = headerSection.split("\r\n");
  const statusLine = lines[0];
  
  // HTTP/1.1 <code> <status>
  const statusMatch = statusLine.match(/^HTTP\/\d\.\d\s+(\d+)\s*(.*)$/);
  if (!statusMatch) {
    throw new error.InvalidHttpResponseError(`Invalid status line: ${statusLine}`);
  }
  
  const statusCode = parseInt(statusMatch[1], 10);
  const statusText = statusMatch[2] || '';
  
  const headers : Record<string, string> = {};

  for (let i = 1; i < lines.length; i++) {
    const colonIndex = lines[i].indexOf(":");
    if (colonIndex !== -1) {
      const key = lines[i].slice(0, colonIndex).trim().toLowerCase();
      const value = lines[i].slice(colonIndex + 1).trim();
      headers[key] = value;
    }
  }

  return {
    statusCode,
    statusText,
    headers,
    bodyStart
  };
}
