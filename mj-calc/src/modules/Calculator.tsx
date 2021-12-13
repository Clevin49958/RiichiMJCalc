import React, { useState } from "react";
import PlayerTable, { IPlayerTable, IPlayer } from "./PlayerTable";
import { getWind, Wind, WindNumber } from "./util/Wind";
import 'bootstrap/dist/css/bootstrap.min.css';

const STARTING_POINT = 25000;
const STARTING_WIND = 0;
const STARTING_HONBA = 0;

type setPlayersTable = (players: IPlayerTable) => void

interface GameStatus {
    wind: WindNumber,
    honba: number,
}

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

function StartGame(setPlayers: setPlayersTable) {

}
export default function Calculator() {
  const [gameStatus, GameStatus] = useState<GameStatus>({
    wind: STARTING_WIND,
    honba: STARTING_HONBA,
  });
  const [players, setPlayers] = useState<IPlayerTable>(
    ([0, 1, 2, 3] as WindNumber[]).map((seating) => ({
      name: getWind(seating),
      seating: seating,
      score: STARTING_POINT,
    })) as IPlayerTable
  );
  const [namesReady, setNamesReady] = useState(false);

  const gameReady = namesReady;
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
      <PlayerTable
        playerTable={players}
        playerCell={(player: IPlayer) =>
          PlayerInputCell(player.seating, players, setPlayers)
        }
        centerCell={() => PlayerInputCenterCell()}/>
    </React.Fragment>
  }
}