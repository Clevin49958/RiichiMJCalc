import { GameSetting } from "../types/GameSetting";
import { GameStatus, RoundNumber } from "../types/GameStatus";
import { WindNumber } from "./Wind";

export function incrementRound(
  gameStatus: GameStatus,
  { numPlayers }: GameSetting
) {
  gameStatus.round = ((gameStatus.round % numPlayers) + 1) as RoundNumber;
  if (gameStatus.round === 1) {
    gameStatus.wind = ((gameStatus.wind + 1) % numPlayers) as WindNumber;
  }
}
