import { GameStatus, RoundNumber } from "../types/GameStatus";
import { WindNumber } from "./Wind";

export function incrementRound(gameStatus: GameStatus) {
  gameStatus.round = ((gameStatus.round % gameStatus.numPlayers) +
    1) as RoundNumber;
  if (gameStatus.round === 1) {
    gameStatus.wind = ((gameStatus.wind + 1) %
      gameStatus.numPlayers) as WindNumber;
  }
}
