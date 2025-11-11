import { assertEquals, assertThrows } from '@std/assert'
import { parseChunkedBody } from './parse_chunked_body.ts';
import { InvalidChunkSizeError, MalformedChunkedEncodingError } from '../../error/index.ts';

Deno.test('Tests "parseChunkedBody"', async (test) => {
  await test.step({
  name: 'Parse valid chunked body.',
    fn() : void {
      const responseContent = '6\r\nHello \r\n6\r\nWorld!\r\n0\r\n\r\n'
      assertEquals(
        parseChunkedBody(responseContent),
        'Hello World!'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Wrong chunk size.',
    fn() : void {
      const responseContent = '6\r\nHello \r\n6\r\nWor\r\n0\r\n\r\n'
      assertThrows(
        () => parseChunkedBody(responseContent),
        InvalidChunkSizeError,
        'Invalid chunk size'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Missing chunk size delimiter.',
    fn() : void {
      const responseContent = '6'
      assertThrows(
        () => parseChunkedBody(responseContent),
        MalformedChunkedEncodingError,
        'Malformed chunked encoding: missing chunk size delimiter'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Chunk size to small for chunk.',
    fn() : void {
      const responseContent = '6\r\nHello \r\n2\r\nWorld!\r\n0\r\n\r\n'
      assertThrows(
        () => parseChunkedBody(responseContent),
        MalformedChunkedEncodingError,
        'Malformed chunked encoding: missing chunk data delimiter'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Chunk size to big for chunk (exceeds end).',
    fn() : void {
      const responseContent = '6\r\nHello \r\n20\r\nWorld!\r\n0\r\n\r\n'
      assertThrows(
        () => parseChunkedBody(responseContent),
        MalformedChunkedEncodingError,
        'Malformed chunked encoding: incomplete chunk data'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Missing 0 at end.',
    fn() : void {
      const responseContent = '6\r\nHello \r\n2\r\nWor\r\n'
      assertThrows(
        () => parseChunkedBody(responseContent),
        MalformedChunkedEncodingError,
        'Malformed chunked encoding: missing chunk data delimiter'
      )
    }
  })

  await test.step({
    name: 'Parse invalid chunked body. Missing \\r\\n\\r\\n at end.',
    fn() : void {
      const responseContent = '6\r\nHello \r\n6\r\nWorld!\r\n0'
      assertThrows(
        () => parseChunkedBody(responseContent),
        MalformedChunkedEncodingError,
        'Malformed chunked encoding: missing chunk size delimiter'
      )
    }
  })
})
