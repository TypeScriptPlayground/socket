import { assertEquals } from '@std/assert'
import { parseHeaders } from './parse_headers.ts';

Deno.test('Tests "parseHeaders"', async (test) => {
  await test.step({
    name: 'Parse valid HTTP headers.',
    fn() : void {
      const responseContent = 'key-1: value1\r\nkey-2: value 2 with space'
      assertEquals(
        Object.fromEntries(parseHeaders(responseContent)),
        {
          'key-1': 'value1',
          'key-2': 'value 2 with space'
        }
      )
    }
  })

  await test.step({
    name: 'Parse (valid) HTTP headers. With leading/trailing newline.',
    fn() : void {
      const responseContent = '\r\nkey-1: value1\r\nkey-2: value 2 with space\r\n'
      assertEquals(
        Object.fromEntries(parseHeaders(responseContent)),
        {
          'key-1': 'value1',
          'key-2': 'value 2 with space'
        }
      )
    }
  })

  await test.step({
    name: 'Parse (valid) HTTP headers. With space in key name.',
    fn() : void {
      const responseContent = 'key 1: value 1 with space'
      assertEquals(
        Object.fromEntries(parseHeaders(responseContent)),
        {'key 1': 'value 1 with space'}
      )
    }
  })
})
