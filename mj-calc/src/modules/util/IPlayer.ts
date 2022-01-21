import { WindNumber } from "./Wind";

export interface IPlayer {
  name: string;
  seating: WindNumber;
  score: number;
  lastScore?: number;
}

export type IPlayerTable = IPlayer[];

export function updatePlayerScore(player: IPlayer, newScore: number) {
  player.lastScore = player.score;
  player.score = newScore;
}
