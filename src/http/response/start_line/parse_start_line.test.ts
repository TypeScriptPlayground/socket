import { assertEquals, assertThrows } from '@std/assert'
import { parseStartLine } from '../start_line/parse_start_line.ts';
import { InvalidStartLineError } from '../../error/invalid_start_line_error.ts';

Deno.test('Tests "parseStartLine"', async (test) => {
  await test.step({
    name: 'Parse valid HTTP response.',
    fn() : void {
      const responseContent = 'HTTP/1.1 200 OK\r\nfoo: bar\r\n\r\n'
      assertEquals(
        parseStartLine(responseContent),
        {
          protocol: 'HTTP/1.1',
          code: 200,
          status: 'OK'
        }
      )
    }
  })

  await test.step({
    name: 'Parse invalid HTTP response.',
    fn() : void {
      const responseContent = 'HTTP/1.1 OK\r\nfoo: bar\r\n\r\n'
      assertThrows(
        () => parseStartLine(responseContent),
        InvalidStartLineError
      )
    }
  })
})
