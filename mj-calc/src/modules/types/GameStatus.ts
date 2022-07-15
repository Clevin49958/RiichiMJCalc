import { WindNumber } from "../util/Wind";

export type RoundNumber = 1 | 2 | 3 | 4;

export type RichiiList = boolean[];

export interface GameStatus {
  wind: WindNumber;
  round: RoundNumber;
  honba: number;
  richiiStick: number;
  richii: RichiiList;
}
