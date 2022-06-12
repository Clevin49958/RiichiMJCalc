import { NP, WindNumber } from "./Wind";

export type RoundNumber = 1 | 2 | 3 | 4;

export type IRichii = boolean[];

export interface GameStatus {
  numPlayers: NP;
  wind: WindNumber;
  round: RoundNumber;
  honba: number;
  richiiStick: number;
  richii: IRichii;
}

export function incrementRound(gameStatus: GameStatus) {
  gameStatus.round = ((gameStatus.round % gameStatus.numPlayers) +
    1) as RoundNumber;
  if (gameStatus.round === 1) {
    gameStatus.wind = ((gameStatus.wind + 1) %
      gameStatus.numPlayers) as WindNumber;
  }
}
