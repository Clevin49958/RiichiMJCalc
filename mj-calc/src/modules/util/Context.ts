import React from "react";
import { Dispatch, SetStateAction } from "react";
import { GameStatus } from "./GameStatus";
import { IPlayer, IPlayerTable } from "./IPlayer";
import { IRecord } from "./IRecord";
import { getWind, NP, WindNumber } from "./Wind";

interface IGameContext {
  gameStatus: GameStatus;
  setGameStatus: Dispatch<SetStateAction<GameStatus>>;
  players: IPlayerTable;
  setPlayers: Dispatch<SetStateAction<IPlayerTable>>;
  records: IRecord[];
}

const _np: NP = 4;

const GameContext = React.createContext<IGameContext>({
  gameStatus: {
    numPlayers: _np,
    honba: 0,
    wind: 0,
    round: 1,
    richiiStick: 0,
    richii: Array(_np).fill(false),
  },
  setGameStatus: (value: SetStateAction<GameStatus>) => {
    throw new Error(
      "Not implemented error. \nUsing setGameStatus from uninitialised context."
    );
  },
  players: (Array.from(Array(_np).keys()) as WindNumber[]).map((value) => ({
    name: `DEFAULT_${getWind(value)}_NAME`,
    score: -1,
    seating: value,
  })),
  setPlayers: (value: SetStateAction<IPlayerTable>) => {
    throw new Error(
      "Not implemented error. \nUsing setPlayers from uninitialised context."
    );
  },
  records: [],
});

export default GameContext;
