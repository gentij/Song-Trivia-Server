import { IRedisClient, redisClient } from '@/databases';
import { JoinRoomDto, SelectRoomPlaylistDto } from '@/dtos/roomSocket.dto';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
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
    const { roomId } = data;

    const room = await this.getRoom(roomId);

    if (!room) {
      console.log('no such room or expired');
      return;
    }

    this.socket.join(roomId);

    await this.redisClient.setEx(`room:${roomId}`, 500, JSON.stringify({ ...room, players: [...new Set([...room.players, this.socket.id])] }));

    return this.io.to(roomId).emit('userJoined', { message: `User: ${this.socket.id} has joined lobby: ${roomId}`, room });
  }

  public async selectRoomPlaylist(data: SelectRoomPlaylistDto) {
    const { playlistId, roomId } = data;

    const room = await this.getRoom(roomId);

    if (!room) {
      console.log('no such room or expired');
      return;
    }

    if (room.creator !== this.socket.id) {
      console.log('user is not the creator of the room');
      return;
    }

    room.playlistId = playlistId;

    await this.setRoom(roomId, room);

    return this.io.to(roomId).emit('playlistSelected', { message: `User: ${this.socket.id} has selected playlist: ${playlistId}`, room });
  }

  public async getRoom(roomId: string) {
    const room = await this.redisClient.get(`room:${roomId}`);

    return room ? JSON.parse(room) : undefined;
  }

  public async setRoom(roomId: string, room: unknown) {
    return await this.redisClient.setEx(`room:${roomId}`, 500, JSON.stringify(room));
  }
}
