import { Server as SocketServer, Socket } from 'socket.io';

export interface SocketController {
  io: SocketServer;
  socket: Socket;
  initializeSockets: Function;
}

export interface SocketControllerConstructable {
    new(io: SocketServer, socket: Socket): SocketController
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  avatar: number;
}

export interface SocketWithUserData extends Socket {
  data: SocketData
}