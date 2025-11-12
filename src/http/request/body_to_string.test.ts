import { assertEquals } from '@std/assert'
import { bodyToString } from './body_to_string.ts';

Deno.test('Tests "bodyToString"', async (test) => {
  await test.step({
    name: 'Convert string to string.',
    fn() : void {
      const testString = 'string';

      const result = bodyToString(testString);

      assertEquals(
        result,
        testString
      )
    }
  })

  await test.step({
    name: 'Convert ArrayBuffer to string.',
    async fn() : Promise<void> {
      const testString = 'ArrayBuffer';

      const buffer = new TextEncoder().encode(testString).buffer;

      const result = await bodyToString(buffer);

      assertEquals(result, testString);
    },
  });

  await test.step({
    name: "Convert Blob to string.",
    async fn() : Promise<void> {
      const testString = 'Blob';

      const blob = new Blob([testString]);

      const result = await bodyToString(blob);

      assertEquals(result, testString);
    },
  });

  await test.step({
    name: 'Convert DataView to string.',
    async fn() : Promise<void> {
      const testString = 'DataView';

      const buffer = new TextEncoder().encode(testString).buffer;
      const dataView = new DataView(buffer);

      const result = await bodyToString(dataView);

      assertEquals(result, testString);
    },
  });

  await test.step({
    name: 'Convert ReadableStream to string.',
    async fn() : Promise<void> {
      const testString = 'ReadableStream';

      const textEncoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) : void {
          controller.enqueue(textEncoder.encode(testString));
          controller.close();
        },
      });

      const result = await bodyToString(stream);

      assertEquals(result, testString);
    },
  });
})
