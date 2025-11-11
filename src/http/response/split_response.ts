import { InvalidResponseError } from '../error/index.ts';
import { SplitResponseResult } from './split_response_result.ts';

/**
 * This function splits the response content into `startLine`, `headers` and `body`.
 * 
 * @param response Response string
 * @returns The split response result.
 */
export function splitResponse(response : string) : SplitResponseResult {
  const headerEnd = response.indexOf('\r\n\r\n');
  
  if (headerEnd === -1) {
    throw new InvalidResponseError();
  }

  const [startLine, ...headers] = response.substring(0, headerEnd).split('\r\n')

  return {
    startLine,
    headers: headers.join('\r\n').trim(),
    body: response.substring(headerEnd+4)
  }
}
