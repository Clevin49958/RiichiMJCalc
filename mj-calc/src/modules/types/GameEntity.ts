import { GameStatus } from "./GameStatus";
import { PlayerList } from "./Player";
import { Record } from "./Record";

/** Represent the whole game entity
 * it could be dumped and exported as json directly
 */
export default interface GameEntity {
  endTime: Date;
  gameStatus: GameStatus;
  players: PlayerList;
  records: Record[];
}
