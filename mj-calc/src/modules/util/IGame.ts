import { GameStatus } from "./GameStatus";
import { IPlayerTable } from "./IPlayer";
import { IRecord } from "./IRecord";

/** Represent the whole game entity
 * it could be dumped and exported as json directly
 */
export default interface IGame {
  endTime: Date;
  gameStatus: GameStatus;
  players: IPlayerTable;
  records: IRecord[];
}
