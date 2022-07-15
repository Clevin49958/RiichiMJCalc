import { WinRecord } from "../types/Record";

export const STARTING_POINT = [25000, 35000, 50000];
export const STARTING_WIND = 0;
export const STARTING_HONBA = 0;
export const StickIconSize = { width: 56, height: 18 };

export const DEFAULT_FAN = 3;
export const DEFAULT_FU = 30;
export const DEFAULT_PLAYER = 0;

export const DEFAULT_WIN_INFO: WinRecord = {
  fan: DEFAULT_FAN,
  fu: DEFAULT_FU,
  winner: DEFAULT_PLAYER,
  dealIn: DEFAULT_PLAYER,
};
