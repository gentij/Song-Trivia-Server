import { Server as SocketServer, Socket } from 'socket.io';

export interface SocketController {
  io: SocketServer;
  socket: Socket;
  initializeSockets: Function;
}

export interface SocketControllerConstructable {
    new(io: SocketServer, socket: Socket): SocketController
}