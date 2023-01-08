import { IRedisClient, redisClient } from '@/databases';
import { JoinRoomDto, SelectRoomPlaylistDto } from '@/dtos/roomSocket.dto';
import { Room } from '@/interfaces/rooms.interface';
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
    const room: Room = {
      id: getRandomCode(),
      creator: this.socket.id,
      players: [],
      playlist: null,
      currentRound: 0,
      totalRounds: 10,
    };

    await this.setRoom(room.id, room);
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

    const updatedRoom = await this.updateRoom(room, { players: [...new Set([...room.players, { id: this.socket.id, ...this.socket.data.player }])] });

    return this.io.to(roomId).emit('userJoined', { message: `User: ${this.socket.id} has joined lobby: ${roomId}`, room: updatedRoom });
  }

  public async selectRoomPlaylist(data: SelectRoomPlaylistDto) {
    const { playlist, roomId } = data;

    const room = await this.getRoom(roomId);

    if (!room) {
      console.log('no such room or expired');
      return;
    }

    if (room.creator !== this.socket.id) {
      console.log('user is not the creator of the room');
      return;
    }

    const updatedRoom = await this.updateRoom(room, { playlist });

    return this.io.to(roomId).emit('playlistSelected', { message: `User: ${this.socket.id} has selected playlist: ${playlist}`, room: updatedRoom });
  }

  public async getRoom(roomId: string): Promise<Room | undefined> {
    const room = await this.redisClient.get(`room:${roomId}`);

    return room ? JSON.parse(room) : undefined;
  }

  public async setRoom(roomId: string, room: Room) {
    await this.redisClient.setEx(`room:${roomId}`, 500, JSON.stringify(room));

    return room;
  }

  public async updateRoom(room: Room, updatedParams: Partial<Room>) {
    const updatedRoom: Room = { ...room, ...updatedParams };
    await this.redisClient.setEx(`room:${room.id}`, 500, JSON.stringify(updatedRoom));

    return updatedRoom;
  }
}
