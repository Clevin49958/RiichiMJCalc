import { ReactNode, useMemo, useState } from "react";
import {
  STARTING_HONBA,
  STARTING_POINT,
  STARTING_WIND,
} from "../util/Constants";
import { GameStatus } from "../util/GameStatus";
import IGame from "../util/IGame";
import { IPlayerTable } from "../util/IPlayer";
import { IRecord } from "../util/IRecord";
import { NP, WindNumber } from "../util/Wind";
import GameContext from "./GameContext";

type GameContextProps = {
  n: NP;
  playerNames: string[];
  state?: IGame;
  children: ReactNode;
};

export function GameContextProvider({ children, ...props }: GameContextProps) {
  let initialGameStatus: GameStatus;
  let initialPlayers: IPlayerTable;
  let initialRecord: IRecord[] = [];
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

  const [players, setPlayers] = useState<IPlayerTable>(initialPlayers);

  const [gameRecord, setGameRecord] = useState<IRecord[]>(initialRecord);

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
