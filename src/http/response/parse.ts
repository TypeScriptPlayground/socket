import { parseStartLine } from './start_line/index.ts';
import { parseHeaders } from './headers/index.ts';
import { parseChunkedBody } from './body/index.ts';
import { splitResponse } from './split_response.ts';

export function parse(response : string) : Response {
  const splitResult = splitResponse(response)
  
  const startLine = parseStartLine(splitResult.startLine);
  const headers = parseHeaders(splitResult.headers);
  let body = splitResult.body;

  if (headers.get('Transfer-Encoding') === 'chunked') {
    body = parseChunkedBody(body);
  }

  return new Response(
    body,
    {
      headers: headers,
      status: startLine.code,
      statusText: startLine.status
    }
  )
}
