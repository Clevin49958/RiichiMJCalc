import React, { Dispatch, SetStateAction } from "react";
import { GameStatus } from "../types/GameStatus";
import { PlayerList } from "../types/Player";
import { GameRecord } from "../types/Record";

interface GameContextType {
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
  players: PlayerList;
  setPlayers: Dispatch<SetStateAction<PlayerList>>;
  records: GameRecord[];
  setRecords: Dispatch<SetStateAction<GameRecord[]>>;
}

const GameContext = React.createContext<GameContextType>({} as GameContextType);

export default GameContext;
