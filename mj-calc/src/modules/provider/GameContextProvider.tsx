import React, { ReactNode, useContext, useMemo, useState } from "react";

import {
  STARTING_HONBA,
  STARTING_POINT,
  STARTING_WIND,
} from "../util/Constants";
import { GameStatus } from "../types/GameStatus";
import GameEntity from "../types/GameEntity";
import { PlayerList } from "../types/Player";
import { GameRecord } from "../types/Record";
import { WindNumber } from "../util/Wind";
import GameContext from "../context/GameContext";
import GameSettingContext from "../context/GameSettingContext";

interface GameContextProps {
  playerNames: string[];
  state?: GameEntity;
  children: ReactNode;
}

export function GameContextProvider({ children, ...props }: GameContextProps) {
  const { numPlayers } = useContext(GameSettingContext);

  let initialGameStatus: GameStatus;
  let initialPlayers: PlayerList;
  let initialRecord: GameRecord[] = [];
  if (props.state) {
    initialGameStatus = props.state.gameStatus;
    initialPlayers = props.state.players;
    initialRecord = props.state.records;
  } else {
    initialGameStatus = {
      wind: STARTING_WIND,
      round: 1,
      honba: STARTING_HONBA,
      richiiStick: 0,
      richii: Array(numPlayers).fill(false),
    };
    const startingPoint = STARTING_POINT[4 - numPlayers];
    initialPlayers = (Array.from(Array(numPlayers).keys()) as WindNumber[]).map(
      (seating) => ({
        name: props.playerNames[seating],
        seating,
        score: startingPoint,
      }),
    );
  }

  const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);

  const [players, setPlayers] = useState<PlayerList>(initialPlayers);

  const [gameRecord, setGameRecord] = useState<GameRecord[]>(initialRecord);

  const gameContext = useMemo(
    () => ({
      gameStatus,
      setGameStatus,
      players,
      setPlayers,
      records: gameRecord,
      setRecords: setGameRecord,
    }),
    [gameStatus, players, gameRecord],
  );
  return (
    <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>
  );
}
