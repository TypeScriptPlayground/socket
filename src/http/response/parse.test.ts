import { assertEquals } from '@std/assert'
import { parse } from './parse.ts';

Deno.test('Tests "parse"', async (test) => {
  await test.step({
    name: 'Parse valid HTTP response.',
    async fn() : Promise<void> {
      const exampleResponse = 'HTTP/1.1 200 OK\r\nFoo-Version: 1.01\r\nContent-Type: application/json\r\nBar-Experimental: false\r\nServer: Bazz/0.0.0 (bazz)\r\nDate: Mon, 10 Nov 2025 15:42:24 GMT\r\nConnection: close\r\n\r\nHello World!\r\n\r\n';

      const response = parse(exampleResponse);

      assertEquals(
        await response.text(),
        'Hello World!'
      )
    }
  })

  await test.step({
    name: 'Parse valid HTTP response. Transfer-Encoded: chunked',
    async fn() : Promise<void> {
      const exampleResponse = 'HTTP/1.1 200 OK\r\nFoo-Version: 1.01\r\nContent-Type: application/text\r\nBar-Experimental: false\r\nServer: Bazz/0.0.0 (bazz)\r\nDate: Mon, 10 Nov 2025 15:42:24 GMT\r\nConnection: close\r\nTransfer-Encoding: chunked\r\n\r\n6\r\nHello \r\n6\r\nWorld!\r\n0\r\n';

      const response = parse(exampleResponse);

      assertEquals(
        await response.text(),
        'Hello World!'
      )
    }
  })

  await test.step({
    name: 'Parse valid HTTP response. Transfer-Encoded: chunked',
    async fn() : Promise<void> {
      const exampleResponse = 'HTTP/1.1 200 OK\r\nFoo-Version: 1.01\r\nContent-Type: application/json\r\nBar-Experimental: false\r\nServer: Bazz/0.0.0 (bazz)\r\nDate: Mon, 10 Nov 2025 15:42:24 GMT\r\nConnection: close\r\n\r\n{"foo": "bar"}\r\n';

      const response = parse(exampleResponse);

      assertEquals(
        await response.json(),
        {foo: 'bar'}
      )
    }
  })
})
