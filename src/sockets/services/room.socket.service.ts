import { IRedisClient, redisClient } from '@/databases';
import { JoinRoomDto } from '@/dtos/roomSocket.dto';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import socketValidationMiddleware from '@/middlewares/socketValidation.middleware';
import { getRandomCode } from '@/utils/getRandomCode';
import { Server as SocketServer } from 'socket.io';

export class RoomSocketService {
  private io: SocketServer;
  private socket: SocketWithUserData;
  private redisClient: IRedisClient;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.redisClient = redisClient;
  }

  public async createRoom() {
    const room = { id: getRandomCode(), creator: this.socket.id, players: [this.socket.id] };
    await this.redisClient.setEx(`room:${room.id}`, 500, JSON.stringify(room));
    return this.joinRoom({ roomId: room.id });
  }

  public async joinRoom(data: JoinRoomDto) {
    if (await socketValidationMiddleware(this.socket, JoinRoomDto, data)) return;

    const { roomId } = data;

    const room = await this.redisClient.get(`room:${roomId}`);

    if (!room) {
      console.log('no such room or expired');
      return;
    }

    const roomData = JSON.parse(room);

    this.socket.join(roomId);

    await this.redisClient.setEx(
      `room:${roomId}`,
      500,
      JSON.stringify({ ...roomData, players: [...new Set([...roomData.players, this.socket.id])] }),
    );

    return this.io.to(roomId).emit('userJoined', { message: `User: ${this.socket.id} has joined lobby: ${roomId}`, roomData });
  }
}
