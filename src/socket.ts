import { method } from './method.ts';
import { SocketRequestInit } from './socket_request_init.ts';
import { SocketOptions } from './socket_options.ts';
import { parseHttpResponse } from './parse_http_response.ts';
import * as error from './error/index.ts'

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * This class represents a UNIX socket connection.
 */
export class Socket {
  readonly socketPath : string;
  readonly connection : Promise<Deno.UnixConn>;

  /**
   * Create a new UNIX socket instance.
   * 
   * @param socketPath Path to the socket, ex. `path/to/socket.sock`
   * @param options Options for the socket connection
   */
  constructor(
    socketPath : string,
    options? : SocketOptions
  ) {
    const socketOptions = Object.assign(
      options ?? {},
      {connect: Deno.connect}
    );
    
    this.socketPath = socketPath;
    this.connection = socketOptions.connect({path: socketPath, transport: 'unix'});
  }

  /**
   * Write to the socket.
   * 
   * @param path Path to write to, ex. `/api/info`
   * @param init Init options for the request
   */
  private async write(
    path : string,
    init : SocketRequestInit
  ) : Promise<number> {
    const connection = await this.connection;

    const headers = Object.assign({
      Connection: 'close',
      Host: 'localhost'
    }, {...init.headers})

    const headerLines = [
      `${init.method} ${path} HTTP/1.1`,
      ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
      '',
      ''
    ];

    const requestPayload = headerLines.join("\r\n");
    return connection.write(textEncoder.encode(requestPayload));
  }

  private decodeChunkedBody(
    bodyStart : string,
    reader : ReadableStreamDefaultReader<Uint8Array>
  ) : ReadableStream<Uint8Array> {
    let buffer = bodyStart;

    return new ReadableStream<Uint8Array>({
      async pull(controller) : Promise<void> {
        while (true) {
          const chunkSizeEnd = buffer.indexOf("\r\n");
          
          if (chunkSizeEnd === -1) {
            const { value, done } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += textDecoder.decode(value);
            continue;
          }

          const chunkSizeHex = buffer.slice(0, chunkSizeEnd).trim();
          const chunkSize = parseInt(chunkSizeHex, 16);

          if (chunkSize === 0) {
            controller.close();
            return;
          }

          buffer = buffer.slice(chunkSizeEnd + 2);

          while (buffer.length < chunkSize + 2) {
            const { value, done } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            buffer += textDecoder.decode(value);
          }

          const chunkData = buffer.slice(0, chunkSize);
          buffer = buffer.slice(chunkSize + 2);

          controller.enqueue(textEncoder.encode(chunkData));

          if (buffer.length === 0) {
            return;
          }
        }
      },
      cancel() : void {
        reader.releaseLock();
      }
    });
  }

  public async request(
    path : string,
    init : SocketRequestInit = {
      method: method.GET,
      headers: {}
    }
  ): Promise<Response> {
    const connection = await this.connection;
    await this.write(path, init);

    const reader = connection.readable.getReader();
    let buffer = '';

    const firstChunk = await reader.read();
    if (firstChunk.done) {
      throw new error.ConnectionClosedError();
    }

    buffer = textDecoder.decode(firstChunk.value);
    
    while (buffer.indexOf("\r\n\r\n") === -1) {
      const chunk = await reader.read();
      if (chunk.done) {
        break
      };
      buffer += textDecoder.decode(
        chunk.value,
        {stream: true}
      );
    }

    const parsedResponse = parseHttpResponse(buffer);

    const isChunked = parsedResponse.headers['transfer-encoding'] === 'chunked';

    let bodyStream : ReadableStream<Uint8Array>;

    if (isChunked) {
      bodyStream = this.decodeChunkedBody(parsedResponse.bodyStart, reader);
    } else {
      bodyStream = new ReadableStream<Uint8Array>({
        start(controller) : void {
          if (parsedResponse.bodyStart) {
            controller.enqueue(textEncoder.encode(parsedResponse!.bodyStart));
          }
        },
        async pull(controller) : Promise<void> {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        },
        cancel() : void {
          reader.releaseLock();
        }
      });
    }

    return new Response(
      bodyStream,
      {
        status: parsedResponse.statusCode,
        statusText: parsedResponse.statusText,
        headers: new Headers(parsedResponse.headers)
      }
    );
  }
}
