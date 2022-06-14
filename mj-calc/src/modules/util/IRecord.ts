import { RoundNumber } from "./GameStatus";
import { WindNumber } from "./Wind";

export interface WinRecord {
  winner: WindNumber;
  dealIn: WindNumber;
  // self deal in == tsumo
}

export interface DrawRecord {
  tenpai: boolean[];
}

type Record =
  | {
      info: WinRecord;
      type: "Win";
    }
  | {
      info: DrawRecord;
      type: "Draw";
    };

export type IRecord = Record & {
  deltas: number[];
  wind: WindNumber;
  round: RoundNumber;
  honba: number;
};
