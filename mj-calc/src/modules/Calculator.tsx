import React, { useState } from "react";
import PlayerTable from "./PlayerTable";
import { IPlayerTable, IPlayer } from "./util/IPlayer";
import { getWind, WindNumber } from "./util/Wind";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameStatus } from "./util/GameStatus";
import { getDealer } from "./util/Score";

const STARTING_POINT = 25000;
const STARTING_WIND = 0;
const STARTING_HONBA = 0;

type setPlayersTable = (players: IPlayerTable) => void

function PlayerInfoCell(
    player: IPlayer
) {
    return <>
        <span>{player.name}</span>
        <br />
        <span>{player.score}</span>
    </>;
}

function GameStatusCenterCell(gameStatus: GameStatus) {
  /** Display Current field wind and honba */
  return <div style={{textAlign: "center"}}>
    {`${getWind(gameStatus.wind)} ${gameStatus.honba}`}
  </div>
}

export default function Calculator() {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    wind: STARTING_WIND,
    round: 1,
    honba: STARTING_HONBA,
    richiiStick: 0,
  });
  const [players, setPlayers] = useState<IPlayerTable>(
    ([0, 1, 2, 3] as WindNumber[]).map((seating) => ({
      name: getWind(seating),
      seating: seating,
      score: STARTING_POINT,
    })) as IPlayerTable
  );

  const GameContext = React.createContext({
    gameStatus,
    players,
    setGameStatus,
    setPlayers,
  })

  const [namesReady, setNamesReady] = useState(false);

  const gameReady = namesReady;

  const Page = () => {
    if (gameReady) {
      return <React.Fragment>
        <PlayerTable
          playerTable={players}
          playerCell={PlayerInfoCell}
          centerCell={() => GameStatusCenterCell(gameStatus)}
          />
      </React.Fragment>
    } else {
      const PlayerInputCell = (seating: WindNumber, players: IPlayerTable, setPlayers: setPlayersTable) => {
        return <input
          aria-label="Player Name"
          className="form-control table-item-player-number"
          placeholder={getWind(seating)}
          onChange={(event) => {
            const newPlayerTable = [...players] as IPlayerTable;
            newPlayerTable[seating] = {
              ...newPlayerTable[seating],
              name: event.target.value,
            }
            setPlayers(newPlayerTable);
          }}
          value={players[seating].name}
        />
      }

      const PlayerInputCenterCell = () => {
        return <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setNamesReady(true);
          }}
          >Go</button>
      }
      return <React.Fragment>
        <h1>Please enter players' names</h1>
        <PlayerTable
          playerTable={players}
          playerCell={(player: IPlayer) =>
            PlayerInputCell(player.seating, players, setPlayers)
          }
          centerCell={() => PlayerInputCenterCell()}/>
      </React.Fragment>
    }
  }

  return <GameContext.Provider value={{
    gameStatus,
    players,
    setGameStatus,
    setPlayers,
  }}>
    <Page />
  </GameContext.Provider>
}

export function newGameStatus(winner: null | WindNumber, isDealerTenpai: boolean, gameStatus: GameStatus) {
  if (winner === null) {
    gameStatus.honba += 1;
    if (!isDealerTenpai) {
      gameStatus.wind = (gameStatus.wind + 1) % 4 as WindNumber;
    }
  } else {
    if (winner == getDealer(gameStatus.wind, gameStatus.round)) {
      gameStatus.honba += 1;
    } else {
      gameStatus.wind = (gameStatus.wind + 1) % 4 as WindNumber;
    }
  }
  return {...gameStatus};
}