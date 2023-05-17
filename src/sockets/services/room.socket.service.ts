import { IRedisClient, redisClient } from '@/databases';
import { JoinRoomDto, SelectRoomPlaylistDto } from '@/dtos/roomSocket.dto';
import { ROOM_STATUS_ENUM, Room } from '@/interfaces/rooms.interface';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import { ErrorSocketResponse, SuccessSocketResponse } from '@/utils/SocketResponse';
import { getRandomCode } from '@/utils/getRandomCode';
import { Server as SocketServer } from 'socket.io';
import { SERVER_SOCKET_EVENTS } from '../events';

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
      status: ROOM_STATUS_ENUM.IDLE,
    };

    await this.setRoom(room.id, room);
    return this.joinRoom({ roomId: room.id });
  }

  public async joinRoom(data: JoinRoomDto) {
    const { roomId } = data;

    const room = await this.getRoom(roomId);

    if (!room) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.USER_JOINED, new ErrorSocketResponse('No such room or expired'));
    }

    this.socket.join(roomId);

    const updatedRoom = await this.updateRoom(room, { players: [...new Set([...room.players, { id: this.socket.id, ...this.socket.data.player }])] });

    return this.io
      .to(roomId)
      .emit(SERVER_SOCKET_EVENTS.USER_JOINED, new SuccessSocketResponse(updatedRoom, `User: ${this.socket.id} has joined lobby: ${roomId}`));
  }

  public async selectRoomPlaylist(data: SelectRoomPlaylistDto) {
    const { playlist, roomId } = data;

    const room = await this.getRoom(roomId);

    if (!room) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.PLAYLIST_SELECTED, new ErrorSocketResponse('No such room or expired'));
    }

    if (room.creator !== this.socket.id) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.PLAYLIST_SELECTED, new ErrorSocketResponse('User is not the creator of the room'));
    }

    const updatedRoom = await this.updateRoom(room, { playlist });

    return this.io
      .to(roomId)
      .emit(
        SERVER_SOCKET_EVENTS.PLAYLIST_SELECTED,
        new SuccessSocketResponse(updatedRoom, `User: ${this.socket.id} has selected playlist: ${playlist}`),
      );
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
