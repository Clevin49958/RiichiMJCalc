import React, { useState } from "react";
import PlayerTable, { IPlayerTable, IPlayer } from "./PlayerTable";
import { getWind, WindNumber } from "./util/Wind";

const STARTING_POINT = 25000;

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



function StartGame(setPlayers: setPlayersTable) {

}
export default function Calculator() {
    const [players, setPlayers] = useState<IPlayerTable>(
      ([0, 1, 2, 3] as WindNumber[]).map((seating) => ({
        name: getWind(seating),
        seating: seating,
        score: STARTING_POINT,
      })) as IPlayerTable
    );
    const [gameReady, setGameReady] = useState(false);
    if (gameReady) {
      return <></>
    } else {
      const PlayerInputCell = (seating: WindNumber, players: IPlayerTable, setPlayers: setPlayersTable) => {
        return <input
          aria-label="Player Name"
          className="form-control table-item-player-number"
          placeholder={getWind(seating)}
          value={players[seating].name}
        />
      }

      const PlayerInputCenterCell = () => {
        return <button
          type="button"
          onClick={
            // TODO
            // setPlayers()
            () => {}
          }
          >Go</button>
      }
      // return <></>
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