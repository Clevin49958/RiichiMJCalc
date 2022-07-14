import { GameStatus } from "./GameStatus";
import { WindNumber } from "../util/Wind";

export interface WinRecord {
  winner: WindNumber;
  // self deal in == tsumo
  dealIn: WindNumber;
  fan: number;
  fu: number;
}

export type DrawRecord = boolean[];

export type EndingRecord = {
  deltas: number[];
} & (
  | {
      info: WinRecord[];
      type: "Win";
    }
  | {
      info: DrawRecord;
      type: "Draw";
    }
);

export type Record = EndingRecord & Omit<GameStatus, "numPlayers">;
