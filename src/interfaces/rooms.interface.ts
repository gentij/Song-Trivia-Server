import { Player } from './player.interface';

export interface Room {
  id: string;
  creator: string;
  playlist: string | null;
  totalRounds: number;
  currentRound: number;
  players: Player[];
}
