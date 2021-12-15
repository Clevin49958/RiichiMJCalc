import { WindNumber } from "./Wind";

interface WinType {
  winner: WindNumber,
  dealIn: WindNumber,
  fan: number,
  fu: number,
  // self deal in == tsumo
}

interface DrawType {
  tenpai: boolean[],
}
interface IRecord {
  type: WinType | DrawType,
  deltas?: number[],
  richii?: boolean[],
}