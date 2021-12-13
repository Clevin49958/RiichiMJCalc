import { GameStatus } from "./GameStatus";
import { IPlayerTable, updatePlayerScore } from "./IPlayer";
import { WindNumber } from "./Wind";

export function roundPoints(pts: number) {
  // ceil to the hundreadth
  return Math.ceil(pts/100)*100;
}

export function getDealer(wind: WindNumber, round: WindNumber) {
  return (wind + round - 1) % 4 as WindNumber;
}

function getBasePoint(fan:number, fu:number) {
  return 2 ^ (fan + 2) * fu;
}

function getDeltaForTsumo(basePoint: number, dealer: WindNumber, seating: WindNumber, honba: number) {
  const deltas = [0, 0, 0, 0];
  const honbaPts = 100 * honba;
  if (dealer == seating) {
    const delta = roundPoints(basePoint * 2 + honbaPts);
    for (let index = 0; index < deltas.length; index++) {
      deltas[index] -= delta;
    }
    deltas[seating] += delta * 4;
  } else {
    for (let index = 0; index < deltas.length; index++) {
      deltas[index] -= roundPoints((index == dealer ? 2 : 1) * basePoint + honbaPts);
    }
    deltas[seating] += -deltas.reduce((a, b) => {return a + b}, 0);
  }
  return deltas;
}

function getDeltaForRon(basePoint: number, dealer: WindNumber, seating: WindNumber, winFrom: WindNumber, honba: number) {
  const deltas = [0, 0, 0, 0];
  const multiplier = dealer == seating ? 6 : 4;
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
    winFrom?: WindNumber,
  ) {
  const dealer = getDealer(gameStatus.wind, gameStatus.round);
  const basePoint = getBasePoint(fan, fu);
  let deltas: number[];
  if (isTsumo) {
    deltas = getDeltaForTsumo(basePoint, dealer, winner, gameStatus.honba);
  } else {
    deltas = getDeltaForRon(basePoint, dealer, winner, winFrom!, gameStatus.honba);
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
    winFrom?: WindNumber,
  ) {
  const deltas = getDeltaWithWinner(
    fan,
    fu,
    isTsumo,
    winner,
    gameStatus,
    winFrom,
  );
  deltas.forEach((delta, index) => {
    updatePlayerScore(players[index], players[index].score + delta);
  })
}