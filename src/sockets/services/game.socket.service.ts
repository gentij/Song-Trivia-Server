import { IRedisClient, redisClient } from '@/databases';
import { ROOM_STATUS_ENUM, Room } from '@/interfaces/rooms.interface';
import { SocketWithUserData } from '@/interfaces/sockets.interface';
import { Server as SocketServer } from 'socket.io';
import { RoomSocketService } from './room.socket.service';
import { ErrorSocketResponse, SuccessSocketResponse } from '@/utils/SocketResponse';
import { SERVER_SOCKET_EVENTS } from '../events';
import PlaylistService from '@/services/playlists.service';
import { getRandomUniqueItems } from '@/utils/getRandomUniqueItems';
import { GuessTrackDto } from '@/dtos/gameSocket.dto';
import { Player } from '@/interfaces/player.interface';

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

    const updatedRoom = await this.roomService.setRoom(room.id, { ...room, tracksToPlay, status: ROOM_STATUS_ENUM.STARTED });

    return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.GAME_STARTED, new SuccessSocketResponse(updatedRoom, `Game started`));
  }

  public async guessTrack({ roomId, guess }: GuessTrackDto) {
    const room = await this.roomService.getRoom(roomId);

    if (!room) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new ErrorSocketResponse('No such room or expired'));
    }

    if (room.status !== ROOM_STATUS_ENUM.STARTED) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new ErrorSocketResponse('Games hasnt started'));
    }

    const playerIndex = room.players.findIndex(player => player.id === this.socket.id);
    const player = room.players[playerIndex];

    if (!player) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new ErrorSocketResponse('Not a member of the room'));
    }

    if (room.currentRound >= player.guesses.length) {
      return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new ErrorSocketResponse('User already guessed for this round'));
    }

    player.guesses[player.guesses.length] = room.tracksToPlay[room.currentRound].id === guess;
    room[playerIndex] = player;

    const updatedRoom = await this.roomService.setRoom(room.id, room);

    await this.checkGamePhase(room);

    return this.io.to(roomId).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new SuccessSocketResponse(updatedRoom, `User ${player.name} guessed`));
  }

  private async checkGamePhase(room: Room) {
    const { players, currentRound, id, totalRounds } = room;

    const allGuesses = players.reduce((acc, { guesses }) => guesses.length + acc, 0);

    if (allGuesses / players.length === currentRound) {
      if (currentRound === totalRounds) {
        // game is done
        // get back to this
        const updatedRoom = await this.roomService.setRoom(room.id, { ...room, status: 'idle' });

        return this.io.to(id).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new SuccessSocketResponse(updatedRoom, `Game finnished`));
      }

      const updatedRoom = await this.roomService.setRoom(room.id, { ...room, currentRound: currentRound + 1 });

      return this.io.to(id).emit(SERVER_SOCKET_EVENTS.TRACK_GUESSED, new SuccessSocketResponse(updatedRoom, `Round ${currentRound} finnished`));
    }
  }
}
