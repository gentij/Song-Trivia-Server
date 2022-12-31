import { Server as SocketServer } from 'socket.io';

export interface SocketController {
  io: SocketServer;
  initializeSockets: Function;
}

export interface SocketControllerConstructable {
    new(io: SocketServer): SocketController
}