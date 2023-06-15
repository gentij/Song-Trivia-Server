import { IRedisClient, redisClient } from '@/databases';
import { ROOM_STATUS_ENUM } from '@/interfaces/rooms.interface';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer } from 'socket.io';
import { RoomSocketService } from './room.socket.service';
import { ErrorSocketResponse, SuccessSocketResponse } from '@/utils/SocketResponse';
import { SERVER_SOCKET_EVENTS } from '../events';
import PlaylistService from '@/services/playlists.service';
import { getRandomUniqueItems } from '@/utils/getRandomUniqueItems';

export class GameSocketService {
  private io: SocketServer;
  private socket: SocketWithUserData;
  private redisClient: IRedisClient;
  private roomService: RoomSocketService;
  private playlistService: PlaylistService;

  constructor(io: SocketServer, socket: SocketWithUserData) {
    this.io = io;
    this.socket = socket;
    this.redisClient = redisClient;
    this.roomService = new RoomSocketService(this.io, this.socket);
    this.playlistService = new PlaylistService();
  }

  public async startGame(roomId: string) {
    const room = await this.roomService.getRoom(roomId);

    if (!room) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.GAME_STARTED, new ErrorSocketResponse('No such room or expired'));
    }

    if (room.creator !== this.socket.id) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.GAME_STARTED, new ErrorSocketResponse('You dont have permission'));
    }

    if (!room.playlist) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.GAME_STARTED, new ErrorSocketResponse('You have not selected a playlist'));
    }

    const allTracks = await this.playlistService.getPlaylistTracks(room.playlist);

    const tracksToPlay = getRandomUniqueItems(allTracks, room.totalRounds).map(({ id }) => ({ id }));

    const updatedRoom = await this.roomService.setRoom(room.id, { ...room, tracksToPlay, status: ROOM_STATUS_ENUM.started });

    return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.GAME_STARTED, new SuccessSocketResponse(updatedRoom, `Game started`));
  }
}
