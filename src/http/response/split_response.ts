import { SplitResponseResult } from './split_response_result.ts';

export function splitResponse(response : string) : SplitResponseResult {
  const [header, body] = response.split('\r\n\r\n', 2);

  const [startLine, headers] = header.split('\r\n');

  return {
    startLine,
    headers,
    body
  }
}
