import { InvalidResponseError } from '../error/index.ts';
import { SplitResponseResult } from './split_response_result.ts';

/**
 * This function splits the response content into `startLine`, `headers` and `body`.
 * 
 * @param response Response string
 * @returns The split response result.
 */
export function splitResponse(response : string) : SplitResponseResult {
  const [header, body] = response.split('\r\n\r\n', 2);

  if (body === undefined) {
    throw new InvalidResponseError();
  }

  const [startLine, headers] = header.split('\r\n');

  return {
    startLine,
    headers,
    body
  }
}
