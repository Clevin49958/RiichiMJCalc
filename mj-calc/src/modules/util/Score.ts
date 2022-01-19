import { GameStatus, RoundNumber } from "./GameStatus";
import { IPlayerTable, updatePlayerScore } from "./IPlayer";
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

export function getDealer(wind: WindNumber, round: RoundNumber) {
  // TODO: update for 3p
  return ((wind + round - 1) % 4) as WindNumber;
}

function getBasePoint(fan: number, fu: number) {
  let base = Math.pow(2, fan + 2) * fu;
  if (fan >= 13) {
    base = 8000;
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
  gameStatus: GameStatus
) {
  const honba = gameStatus.honba;
  const nP = gameStatus.numPlayers;
  const deltas = Array(nP);
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
    deltas[seating] += -deltas.reduce((a, b) => {
      return a + b;
    }, 0);
  }
  return deltas;
}

function getDeltaForRon(
  basePoint: number,
  dealer: WindNumber,
  seating: WindNumber,
  winFrom: WindNumber,
  gameStatus: GameStatus
) {
  const honba = gameStatus.honba;
  const nP = gameStatus.numPlayers;
  const deltas = Array(nP);
  const multiplier = dealer === seating ? 6 : 4;
  const score = roundPoints(multiplier * basePoint + 300 * honba);
  deltas[seating] += score;
  deltas[winFrom] -= score;
  return deltas;
}

export function getDeltaWithWinner(
  fan: number,
  fu: number,
  isTsumo: boolean,
  winner: WindNumber,
  gameStatus: GameStatus,
  winFrom?: WindNumber
) {
  const dealer = getDealer(gameStatus.wind, gameStatus.round);
  const basePoint = getBasePoint(fan, fu);
  let deltas: number[];
  // 2 player Tsumo is treated as the other player deal in
  // because there's no Tsumo reduction as in 3p
  if (isTsumo) {
    if (gameStatus.numPlayers == 2) {
      deltas = getDeltaForRon(
        basePoint,
        dealer,
        winner,
        (1 - winner) as WindNumber,
        gameStatus
      );
    } else {
      deltas = getDeltaForTsumo(basePoint, dealer, winner, gameStatus);
    }
  } else {
    deltas = getDeltaForRon(basePoint, dealer, winner, winFrom!, gameStatus);
  }

  // richii stick
  deltas[winner] += gameStatus.richiiStick * 1000;

  return deltas;
}

export function applyScoreChangeWithWinner(
  fan: number,
  fu: number,
  isTsumo: boolean,
  winner: WindNumber,
  gameStatus: GameStatus,
  players: IPlayerTable,
  winFrom?: WindNumber
) {
  const deltas = getDeltaWithWinner(
    fan,
    fu,
    isTsumo,
    winner,
    gameStatus,
    winFrom
  );
  deltas.forEach((delta, index) => {
    updatePlayerScore(players[index], players[index].score + delta);
  });
}

export function getDeltaWithoutWinner(isTenPai: boolean[]) {
  // numOfPeopleTenpai
  const nTenpai = isTenPai.reduce((prev, curr) => prev + (curr ? 1 : 0), 0);

  if (nTenpai === 0 || nTenpai === isTenPai.length) {
    // array of 0s
    return Array(isTenPai.length);
  }

  const bappu = NOTEN_BAPPU[isTenPai.length.toString(10) as "2" | "3" | "4"];
  return isTenPai.map((value) => {
    return value ? bappu[isTenPai.length - nTenpai - 1] : -bappu[nTenpai - 1];
  });
}

export function applyScoreChange(players: IPlayerTable, deltas: number[]) {
  deltas.forEach((delta, index) => {
    updatePlayerScore(players[index], players[index].score + delta);
  });
}
