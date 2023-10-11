import { Server, ServerOptions } from 'socket.io';
import { Server as HttpServer } from 'http';
import {
  ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData,
} from '../socket_io';

export default class CustomSocketServer extends Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  constructor(
    httpServer: HttpServer,
    options?: Partial<ServerOptions> & { addTrailingSlash?: boolean },
  ) {
    super(httpServer, options);

    // Access the addTrailingSlash option if needed
    if (options?.addTrailingSlash !== undefined) {
      // You can use the addTrailingSlash variable here if needed
    }
  }
}
