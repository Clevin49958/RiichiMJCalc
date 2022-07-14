import { RoundNumber } from "./GameStatus";
import { WindNumber } from "../util/Wind";

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

type EndingRecord =
  | {
      info: WinRecord[];
      type: "Win";
    }
  | {
      info: DrawRecord;
      type: "Draw";
    };

export type Record = EndingRecord & {
  deltas: number[];
  wind: WindNumber;
  round: RoundNumber;
  honba: number;
};
