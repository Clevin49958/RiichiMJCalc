import { GameSetting } from "./GameSetting";
import { GameStatus } from "./GameStatus";
import { PlayerList } from "./Player";
import { GameRecord } from "./Record";

/** Represent the whole game entity
 * it could be dumped and exported as json directly
 */
export default interface GameEntity {
  settings: GameSetting;
  endTime: Date;
  gameStatus: GameStatus;
  players: PlayerList;
  records: GameRecord[];
}
