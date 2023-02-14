import { includes } from "lodash";

import { GameSetting } from "../types/GameSetting";
import { GameStatus, RoundNumber } from "../types/GameStatus";
import { EndingRecord } from "../types/Record";

import { getDealer } from "./Score";
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

export function nextGameStatus(
  endingRecord: EndingRecord,
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  // update honba
  if (endingRecord.type === "Draw") {
    const isDealerTenpai =
      endingRecord.info[getDealer(gameStatus, gameSetting)];
    gameStatus.honba += 1;
    if (!isDealerTenpai) {
      incrementRound(gameStatus, gameSetting);
    }
  } else {
    const winner = endingRecord.info.map((record) => record.winner);
    if (includes(winner, getDealer(gameStatus, gameSetting))) {
      gameStatus.honba += 1;
    } else {
      incrementRound(gameStatus, gameSetting);
      gameStatus.honba = 0;
    }
    gameStatus.richiiStick = 0;
  }
  // update richii state
  gameStatus.richii = Array(gameSetting.numPlayers).fill(false);

  return { ...gameStatus };
}
