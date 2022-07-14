import { ReactNode, useMemo, useState } from "react";
import {
  STARTING_HONBA,
  STARTING_POINT,
  STARTING_WIND,
} from "../util/Constants";
import { GameStatus } from "../types/GameStatus";
import GameEntity from "../types/GameEntity";
import { PlayerList } from "../types/Player";
import { Record } from "../types/Record";
import { NP, WindNumber } from "../util/Wind";
import GameContext from "../context/GameContext";

type GameContextProps = {
  n: NP;
  playerNames: string[];
  state?: GameEntity;
  children: ReactNode;
};

export function GameContextProvider({ children, ...props }: GameContextProps) {
  let initialGameStatus: GameStatus;
  let initialPlayers: PlayerList;
  let initialRecord: Record[] = [];
  if (props.state) {
    initialGameStatus = props.state.gameStatus;
    initialPlayers = props.state.players;
    initialRecord = props.state.records;
  } else {
    initialGameStatus = {
      numPlayers: props.n,
      wind: STARTING_WIND,
      round: 1,
      honba: STARTING_HONBA,
      richiiStick: 0,
      richii: Array(props.n).fill(false),
    };
    const startingPoint = STARTING_POINT[4 - props.n];
    initialPlayers = (Array.from(Array(props.n).keys()) as WindNumber[]).map(
      (seating) => ({
        name: props.playerNames[seating],
        seating,
        score: startingPoint,
      })
    );
  }

  const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);

  const [players, setPlayers] = useState<PlayerList>(initialPlayers);

  const [gameRecord, setGameRecord] = useState<Record[]>(initialRecord);

  const gameContext = useMemo(
    () => ({
      gameStatus,
      setGameStatus,
      players,
      setPlayers,
      records: gameRecord,
      setRecords: setGameRecord,
    }),
    [gameStatus, players, gameRecord]
  );
  return (
    <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>
  );
}
