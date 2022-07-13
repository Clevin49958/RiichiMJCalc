import React, { Dispatch, SetStateAction } from "react";
import { GameStatus } from "../util/GameStatus";
import { IPlayerTable } from "../util/IPlayer";
import { IRecord } from "../util/IRecord";

interface GameContextType {
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
  players: IPlayerTable;
  setPlayers: Dispatch<SetStateAction<IPlayerTable>>;
  records: IRecord[];
  setRecords: Dispatch<SetStateAction<IRecord[]>>;
}

const GameContext = React.createContext<GameContextType>({} as GameContextType);

export default GameContext;
