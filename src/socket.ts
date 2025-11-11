import { method } from './method.ts';
import { SocketRequestInit } from './socket_request_init.ts';
import { SocketOptions } from './socket_options.ts';
import { parse } from './http/response/parse.ts';

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

  public async request(
    path : string,
    init : SocketRequestInit = {
      method: method.GET,
      headers: {}
    }
  ): Promise<Response> {
    const connection = await this.connection;
    await this.write(path, init);

    let buffer = new Uint8Array()
    for await (const chunk of connection.readable) {
      buffer = new Uint8Array([...buffer, ...chunk])
    }

    return parse(textDecoder.decode(buffer));
  }
}
