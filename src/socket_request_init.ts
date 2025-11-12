import { Method } from './method.ts';

export interface SocketRequestInit {
  method? : Method,
  headers? : Record<string, string>,
  body? : string | ArrayBuffer | Blob | DataView | ReadableStream
}
