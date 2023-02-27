import { WindNumber } from "../util/Wind";

import { GameStatus } from "./GameStatus";

export interface WinRecord {
  winner: WindNumber;
  // self deal in == tsumo
  dealIn: WindNumber;
  fan: number;
  fu: number;
}

export type DrawRecord = boolean[];

export type EndingType = "Win" | "Draw";

export type EndingRecord =
  | {
      info: WinRecord[];
      type: "Win";
    }
  | {
      info: DrawRecord;
      type: "Draw";
    };

export type EndingRecordWithDeltas = {
  deltas: number[];
} & EndingRecord;

export type GameRecord = EndingRecordWithDeltas & GameStatus;
