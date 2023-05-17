import { Room } from '@/interfaces/rooms.interface';

export class SuccessSocketResponse {
  public message: string;
  public room: Room;

  constructor(room: Room, message: string) {
    this.room = room;
    this.message = message;
  }
}

export class ErrorSocketResponse {
  public isError = true;
  public error: string;

  constructor(error: string) {
    this.error = error;
  }
}
