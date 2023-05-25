import { NP } from "../util/Wind";

export type GameMode = "default";

export const gameModes = ["default"] as const;

export interface GameSetting {
  numPlayers: NP;
  gameMode: GameMode;
}
