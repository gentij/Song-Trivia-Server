import { CreateRoomDto } from '@/dtos/roomSocket.dto';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import socketValidationMiddleware from '@/middlewares/socketValidation.middleware';
import { getRandomCode } from '@/utils/getRandomCode';
import { Server as SocketServer } from 'socket.io';

export class RoomSocketService {
  private io: SocketServer;
  private socket: SocketWithUserData;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
  }

  public createRoom() {
    const room = { id: getRandomCode(), creator: this.socket.id };
    return this.joinRoom({ roomId: room.id })
  }

  public joinRoom(data: CreateRoomDto) {
    if(socketValidationMiddleware(this.socket, CreateRoomDto, data)) return;
    this.socket.join(data.roomId);

    return this.io.to(data.roomId).emit('userJoined', { message: `User: ${this.socket.id} has joined lobby: ${data.roomId}` });
  }
}
