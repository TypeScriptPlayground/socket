import { InvalidBodyTypeError } from '../error/index.ts';

/**
 * This function converts the different input type into a string.
 * 
 * @param body Input body
 * 
 * @throws `InvalidBodyTypeError` if the input is an invalid
 * @returns The body as a string.
 */
export function bodyToString(body : string | ArrayBuffer | Blob | DataView | ReadableStream) : string | Promise<string> {
  const textDecoder = new TextDecoder()
  
  if (typeof body === "string") {
    return body;
  }

  if (body instanceof Blob) {
    return body.text();
  }

  if (body instanceof ArrayBuffer) {
    return textDecoder.decode(body);
  }

  if (body instanceof DataView) {
    return textDecoder.decode(body.buffer);
  }

  if (body instanceof ReadableStream) {
    return new Response(body).text();
  }

  throw new InvalidBodyTypeError();
}
