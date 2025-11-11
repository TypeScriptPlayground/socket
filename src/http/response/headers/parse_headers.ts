/**
 * This function parses the HTTP response, and returns the headers.
 *
 * @param response Response string
 * @returns The headers as `<key>: <value>` map.
 */
export function parseHeaders(response : string) : Map<string, string> {
  const headers = new Map<string, string>();
  response.trim().split('\r\n').forEach((line) => {
    const [key, value] = line.split(':');
    headers.set(key.toLocaleLowerCase(), value.trim());
  })

  return headers;
}
