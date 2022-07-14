import { WindNumber } from "../util/Wind";

export interface Player {
  name: string;
  seating: WindNumber;
  score: number;
}

export type PlayerList = Player[];
