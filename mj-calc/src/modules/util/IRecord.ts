import { RoundNumber } from "./GameStatus";
import { WindNumber } from "./Wind";

export interface WinRecord {
  winner: WindNumber,
  dealIn: WindNumber,
  // self deal in == tsumo
}

export interface DrawRecord {
  tenpai: boolean[],
}

export interface IRecord {
  info: WinRecord | DrawRecord,
  type: "Win" | "Draw", 
  deltas: number[],
  wind: WindNumber,
  round: RoundNumber,
  honba: number,
}