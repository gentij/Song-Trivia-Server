import { getRandomCode } from '@/utils/getRandomCode';
import { Server as SocketServer, Socket } from 'socket.io';

export class RoomSocketService {
  private io: SocketServer;
  private socket: Socket;

  constructor(io: SocketServer, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public createRoom(socketData) {
    const room = { id: getRandomCode() };

    return this.joinRoom(room)
  }

  public joinRoom(socketData) {
    this.socket.join(socketData.id);

    this.io.to(socketData.id).emit('userJoined', { message: 'User joined lobby', ...socketData });
  }
}
