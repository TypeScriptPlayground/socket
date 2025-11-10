import { parseHeaders } from './headers/index.ts';
import { splitResponse } from './split_response.ts';
import { parseStartLine } from './start_line/index.ts';

export function parse(response : string) : Response {
  const splitResult = splitResponse(response)
  
  const startLine = parseStartLine(splitResult.startLine);
  const headers = parseHeaders(splitResult.headers);
  const body = splitResult.body;

  return new Response(
    body,
    {
      headers: headers,
      status: startLine.code,
      statusText: startLine.status
    }
  )
}
