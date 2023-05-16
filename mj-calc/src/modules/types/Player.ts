import { WindNumber } from "../util/Wind";

export interface Player {
  name: string;
  seating: WindNumber;
  score: number;
}

export type PlayerList = Player[];

export const DEFAULT_N_PLAYERS = 4;
