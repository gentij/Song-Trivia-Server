import { IRedisClient, redisClient } from '@/databases';
import { ROOM_STATUS_ENUM } from '@/interfaces/rooms.interface';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer } from 'socket.io';
import { RoomSocketService } from './room.socket.service';

export class GameSocketService {
  private io: SocketServer;
  private socket: SocketWithUserData;
  private redisClient: IRedisClient;
  private roomService: RoomSocketService;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.redisClient = redisClient;
    this.roomService = new RoomSocketService(this.io, this.socket);
  }

  public async startGame(roomId: string) {
    const room = await this.roomService.getRoom(roomId);

    if (!room) {
      console.log('no such room or expired');
      return;
    }

    if (room.creator !== this.socket.id) {
      console.log('You dont have permission');
      return;
    }

    const updatedRoom = await this.roomService.setRoom(room.id, { ...room, status: ROOM_STATUS_ENUM.started });

    return this.io.to(roomId).emit('gameStarted', { message: `Game started`, room: updatedRoom });
  }
}
