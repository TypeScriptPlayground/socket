import { assertEquals, assertThrows } from '@std/assert'
import { splitResponse } from './split_response.ts';
import { InvalidResponseError } from '../error/invalid_response_error.ts';

Deno.test('Tests "splitResponse"', async (test) => {
  await test.step({
    name: 'Split valid HTTP response.',
    fn() : void {
      const responseContent = 'HTTP/1.1 200 OK\r\nkey-1: value 1\r\nkey-2: value 2\r\n\r\nHello World'
      assertEquals(
        splitResponse(responseContent),
        {
          startLine: 'HTTP/1.1 200 OK',
          headers: 'key-1: value 1\r\nkey-2: value 2',
          body: 'Hello World'
        }
      )
    }
  })

  await test.step({
    name: 'Split valid HTTP response. Empty body.',
    fn() : void {
      const responseContent = 'HTTP/1.1 200 OK\r\nkey-1: value 1\r\nkey-2: value 2\r\n\r\n'
      assertEquals(
        splitResponse(responseContent),
        {
          startLine: 'HTTP/1.1 200 OK',
          headers: 'key-1: value 1\r\nkey-2: value 2',
          body: ''
        }
      )
    }
  })

  await test.step({
    name: 'Split invalid HTTP response.',
    fn() : void {
      const responseContent = 'HTTP/1.1 OK\r\nkey-1: value 1\r\nkey-2: value 2\r\n'
      assertThrows(
        () => splitResponse(responseContent),
        InvalidResponseError
      )
    }
  })
})
