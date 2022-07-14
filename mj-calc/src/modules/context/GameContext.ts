import React, { Dispatch, SetStateAction } from "react";
import { GameStatus } from "../types/GameStatus";
import { PlayerList } from "../types/Player";
import { Record } from "../types/Record";

interface GameContextType {
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
  players: PlayerList;
  setPlayers: Dispatch<SetStateAction<PlayerList>>;
  records: Record[];
  setRecords: Dispatch<SetStateAction<Record[]>>;
}

const GameContext = React.createContext<GameContextType>({} as GameContextType);

export default GameContext;
