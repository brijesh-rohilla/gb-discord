export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (_a: number, _b: string, _c: Buffer) => void;
  withAck: (_d: string, _callback: (_e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
