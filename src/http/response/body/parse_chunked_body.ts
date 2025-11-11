import { InvalidChunkSizeError, MalformedChunkedEncodingError } from '../../error/index.ts';

/**
 * Parses an HTTP chunked transfer encoded body and returns the decoded content.
 * 
 * Chunked encoding format:
 * - Each chunk starts with its size in hexadecimal followed by \r\n
 * - Then the chunk data followed by \r\n
 * - Final chunk has size 0
 * 
 * @example
 * ```
 * 6\r\n
 * Hello \r\n
 * 6\r\n
 * World!\r\n
 * 0\r\n
 * \r\n
 * ```
 * Results in: "Hello World!"
 * 
 * @param body The chunked encoded body string
 * @throws `MalformedChunkedEncodingError` if the chunked encoding is malformed
 * @returns The decoded body content
 */
export function parseChunkedBody(body : string) : string {
  let result = '';
  let position = 0;

  while (position < body.length) {
    const chunkSizeEnd = body.indexOf("\r\n", position);
    
    if (chunkSizeEnd === -1) {
      throw new MalformedChunkedEncodingError('missing chunk size delimiter');
    }

    const chunkSizeHex = body.slice(position, chunkSizeEnd).trim();
    
    // Handle chunk extensions (ex. "1a; name=value")
    const chunkSizeOnly = chunkSizeHex.split(';')[0].trim();
    const chunkSize = parseInt(chunkSizeOnly, 16);

    if (isNaN(chunkSize)) {
      throw new InvalidChunkSizeError();
    }

    // Chunk size 0 indicates the end
    if (chunkSize === 0) {
      break;
    }

    position = chunkSizeEnd + 2; // +2 for \r\n

    // Verify we have enough data for the chunk
    if (position + chunkSize > body.length) {
      throw new MalformedChunkedEncodingError('incomplete chunk data');
    }

    // Extract chunk data
    const chunkData = body.slice(position, position + chunkSize);
    result += chunkData;

    position += chunkSize;

    if (body.slice(position, position + 2) !== "\r\n") {
      throw new MalformedChunkedEncodingError('missing chunk data delimiter');
    }

    position += 2; // Skip trailing \r\n
  }

  return result;
}
