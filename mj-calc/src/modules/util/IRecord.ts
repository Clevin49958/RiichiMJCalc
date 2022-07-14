import { RoundNumber } from "./GameStatus";
import { WindNumber } from "./Wind";

export interface WinRecord {
  winner: WindNumber;
  // self deal in == tsumo
  dealIn: WindNumber;
  fan: number;
  fu: number;
}

export interface DrawRecord {
  tenpai: boolean[];
}

type Record =
  | {
      info: WinRecord[];
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
