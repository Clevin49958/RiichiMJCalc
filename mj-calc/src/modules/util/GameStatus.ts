import { WindNumber } from "./Wind";

export type RoundNumber = 1 | 2 | 3 | 4;

export type IRichii = [boolean, boolean, boolean, boolean]

export interface GameStatus {
  wind: WindNumber;
  round: RoundNumber;
  honba: number;
  richiiStick: number;
  richii: IRichii;
}

export function incrementRound(gameStatus: GameStatus) {
  gameStatus.round = (gameStatus.round) % 4 + 1 as RoundNumber;
  if (gameStatus.round === 1) {
    gameStatus.wind = (gameStatus.wind + 1) % 4 as WindNumber
  }
}