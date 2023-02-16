import { NP } from "../util/Wind";

export type GameMode = "default";

export interface GameSetting {
  numPlayers: NP;
  gameMode: GameMode;
}
