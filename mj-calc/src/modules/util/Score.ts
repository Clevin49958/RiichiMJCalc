/* eslint-disable @typescript-eslint/naming-convention */
import { GameSetting } from "../types/GameSetting";
import { GameStatus } from "../types/GameStatus";
import { PlayerList } from "../types/Player";
import { EndingRecord, WinRecord } from "../types/Record";

import { WindNumber } from "./Wind";

const NOTEN_BAPPU = {
  "4": [1000, 1500, 3000],
  "3": [1000, 2000],
  "2": [1000],
};

export function roundPoints(pts: number) {
  // ceil to the hundreadth
  return Math.ceil(pts / 100) * 100;
}

export function getDealer(
  gameStatus: Pick<GameStatus, "round">,
  gameSetting: Pick<GameSetting, "numPlayers">
) {
  return ((gameStatus.round - 1) % gameSetting.numPlayers) as WindNumber;
}

function getBasePoint(fan: number, fu: number) {
  let base = 2 ** (fan + 2) * fu;
  if (fan >= 13) {
    base = (fan / 13) * 8000;
  } else if (fan >= 11) {
    base = 6000;
  } else if (fan >= 8) {
    base = 4000;
  } else if (fan >= 6) {
    base = 3000;
  } else if (fan >= 5 || (fan === 4 && fu >= 40) || (fan === 3 && fu >= 70)) {
    base = 2000;
  }
  return base;
}

function getDeltaForTsumo(
  basePoint: number,
  dealer: WindNumber,
  seating: WindNumber,
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  const { honba } = gameStatus;
  const nP = gameSetting.numPlayers;
  const deltas: number[] = Array(nP).fill(0);
  const honbaPts = 100 * honba;
  if (dealer === seating) {
    const delta = roundPoints(basePoint * 2 + honbaPts);
    for (let index = 0; index < deltas.length; index++) {
      deltas[index] -= delta;
    }
    deltas[seating] += delta * nP;
  } else {
    for (let index = 0; index < deltas.length; index++) {
      deltas[index] -= roundPoints(
        (index === dealer ? 2 : 1) * basePoint + honbaPts
      );
    }
    deltas[seating] += -deltas.reduce((a, b) => a + b, 0);
  }
  return deltas;
}

function getDeltaForRon(
  basePoint: number,
  dealer: WindNumber,
  seating: WindNumber,
  winFrom: WindNumber,
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  const { honba } = gameStatus;
  const nP = gameSetting.numPlayers;
  const deltas = Array(nP).fill(0);
  const multiplier = dealer === seating ? 6 : 4;
  const score = roundPoints(multiplier * basePoint + 300 * honba);
  deltas[seating] += score;
  deltas[winFrom] -= score;
  return deltas;
}

export function getDeltaOneWinner(
  record: WinRecord,
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  const { fan, fu, winner, dealIn: winFrom } = record;
  const isTsumo = winFrom === winner;
  const dealer = getDealer(gameStatus, gameSetting);
  const basePoint = getBasePoint(fan, fu);
  let deltas: number[];
  // 2 player Tsumo is treated as the other player deal in
  // because there's no Tsumo reduction as in 3p
  if (isTsumo) {
    if (gameSetting.numPlayers === 2) {
      deltas = getDeltaForRon(
        basePoint,
        dealer,
        winner,
        (1 - winner) as WindNumber,
        gameStatus,
        gameSetting
      );
    } else {
      deltas = getDeltaForTsumo(
        basePoint,
        dealer,
        winner,
        gameStatus,
        gameSetting
      );
    }
  } else {
    deltas = getDeltaForRon(
      basePoint,
      dealer,
      winner,
      winFrom,
      gameStatus,
      gameSetting
    );
  }
  return deltas;
}

export function getDeltaWithWinner(
  records: WinRecord[],
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  const deltaArr = records.map((record) =>
    getDeltaOneWinner(record, gameStatus, gameSetting)
  );

  // sum all deltas
  const deltas = deltaArr.reduce<number[]>(
    (prev, curr) => prev.map((val, idx) => val + curr[idx]),
    Array(gameSetting.numPlayers).fill(0)
  );
  // richii stick
  // The RHS of the one who deal in gets richii stick
  const { dealIn } = records[0];
  const winners = records.map((record) =>
    record.winner < dealIn
      ? record.winner + gameSetting.numPlayers
      : record.winner
  );
  const getter = (Math.min(...winners) % gameSetting.numPlayers) as WindNumber;
  deltas[getter] += gameStatus.richiiStick * 1000;

  return deltas;
}

export function getDeltaWithoutWinner(isTenPai: boolean[]) {
  // numOfPeopleTenpai
  const nTenpai = isTenPai.reduce((prev, curr) => prev + (curr ? 1 : 0), 0);

  if (nTenpai === 0 || nTenpai === isTenPai.length) {
    // array of 0s
    return Array(isTenPai.length).fill(0) as number[];
  }

  const bappu = NOTEN_BAPPU[isTenPai.length.toString(10) as "2" | "3" | "4"];
  return isTenPai.map((value) =>
    value ? bappu[isTenPai.length - nTenpai - 1] : -bappu[nTenpai - 1]
  );
}

export function getDeltas(
  endingRecord: EndingRecord,
  gameStatus: GameStatus,
  gameSetting: GameSetting
) {
  if (endingRecord.type === "Win") {
    return getDeltaWithWinner(endingRecord.info, gameStatus, gameSetting);
  }
  return getDeltaWithoutWinner(endingRecord.info);
}

export function applyScoreChange(
  players: PlayerList,
  deltas: number[]
): PlayerList {
  return deltas.map((delta, index) => ({
    ...players[index],
    score: players[index].score + delta,
  }));
}
