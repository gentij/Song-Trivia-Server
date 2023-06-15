import { Player } from './player.interface';

export enum ROOM_STATUS_ENUM {
  IDLE = 'idle',
  STARTED = 'started',
}

export type ROOM_STATUS = 'idle' | 'started';

export interface Room {
  id: string;
  creator: string;
  playlist: string | null;
  totalRounds: number;
  currentRound: number;
  roundDuration: number;
  players: Player[];
  status: ROOM_STATUS;
  tracksToPlay?: Array<{ id: string }>;
}
