import { method } from './method.ts';
import { SocketRequestInit } from './socket_request_init.ts';
import { SocketOptions } from './socket_options.ts';
import { parse } from './http/response/parse.ts';
import { bodyToString } from './http/request/index.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * This class represents a UNIX socket connection.
 */
export class Socket {
  readonly socketPath : string;
  private readonly connect: () => Promise<Deno.UnixConn>;

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
    this.connect = () => socketOptions.connect({path: this.socketPath, transport: 'unix'});
  }

  public async request(
    path : string,
    init? : SocketRequestInit
  ) : Promise<Response> {
    const connection = await this.connect();

    const headers = Object.assign({
      Connection: 'close',
      Host: 'localhost',
    }, {...init?.headers})

    let bodyString = '';
    if (init?.body) {
      bodyString = await bodyToString(init.body);
      headers['Content-Length'] ??= new TextEncoder().encode(bodyString).length.toString();
    }

    const payload = [
      `${init?.method ?? method.GET} ${path} HTTP/1.1`,
      ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
      '',
      bodyString
    ].join("\r\n");

    await connection.write(textEncoder.encode(payload));

    let buffer = new Uint8Array()
    for await (const chunk of connection.readable) {
      buffer = new Uint8Array([...buffer, ...chunk])
    }

    try {
      connection.close();
    } catch (_error) {
      // We assume that the connection got already closed.
    }
    
    return parse(textDecoder.decode(buffer));
  }
}
