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

function DropdownEntry<T extends string | number>({
  label,
  keys,
  values,
  setter,
  value,
  cast,
} : {
  label: string,
  keys: string[] | number[],
  values: T[],
  value: T | null,
  setter: (t: T) => void,
  cast: (value: string) => T,
}) {
  return <div>
    <span>{label}: </span>
    <select
      className="form-select"
      aria-label={`Select ${label}`}
      onChange={e => setter(cast(e.target.value))}>
    <option selected={value === null}>{label}</option>
    {keys.map((key, index) => {
      const v = values[index];
      return <option selected={value == v} value={v}>{key}</option>
    })}
  </select>
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

  const [fan, setFan] = useState<number | null>(null);
  const [fu, setFu] = useState<number | null>(null);
  const [winner, setWinner] = useState<WindNumber | null>(null);
  const [dealIn, setDealIn] = useState<WindNumber | null>(null);
  const [tempai, setTenpai] = useState([false, false, false, false]);
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");

  const isReady = true // TODO (fan !== null && fu !== null &&

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
      const fans = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
      return <React.Fragment>
        <PlayerTable
          playerTable={players}
          playerCell={PlayerInfoCell}
          centerCell={() => GameStatusCenterCell(gameStatus)}
        />
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button className="nav-link active" id="nav-win-tab" data-bs-toggle="tab" data-bs-target="#nav-win" type="button" role="tab" aria-controls="nav-win" aria-selected="true" onClick={() => setEndingType("Win")}>Win</button>
            <button className="nav-link" id="nav-draw-tab" data-bs-toggle="tab" data-bs-target="#nav-draw" type="button" role="tab" aria-controls="nav-draw" aria-selected="false" onClick={() => setEndingType("Draw")}>Draw</button>
            {/* <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button> */}
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-win" role="tabpanel" aria-labelledby="nav-win-tab">
            <div className="d-flex flex-row flex-wrap">
              <DropdownEntry
                label="Fan"
                keys={fans}
                values={fans}
                value={fan}
                setter={(v) => setFan(v)}
                cast={parseInt}
              />

              <DropdownEntry
                label="Fu"
                keys={fus}
                values={fus}
                value={fu}
                setter={(v) => setFu(v)}
                cast={parseInt}
              />

              <DropdownEntry
                label="Winner"
                keys={players.map(p => p.name)}
                values={players.map(p => p.seating)}
                value={winner}
                setter={(v) => setWinner(v as WindNumber)}
                cast={parseInt}
              />

              <DropdownEntry
                label="Deal in"
                keys={players.map(p => p.seating == winner ? "Tsumo" : p.name)}
                values={players.map(p => p.seating)}
                value={dealIn}
                setter={(v) => setDealIn(v as WindNumber)}
                cast={parseInt}
              />


            </div>
          </div>
          <div className="tab-pane fade" id="nav-draw" role="tabpanel" aria-labelledby="nav-draw-tab">
            Draw tab
          </div>
          {/* <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div> */}
          <button
            className="btn btn-primary"
            type="button"
            onClick={/** TODO */() => {}}
            disabled={!isReady}
          >
            Save entry
          </button>
        </div>
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
          centerCell={() => PlayerInputCenterCell()}
        />
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
    if (winner === getDealer(gameStatus.wind, gameStatus.round)) {
      gameStatus.honba += 1;
    } else {
      gameStatus.wind = (gameStatus.wind + 1) % 4 as WindNumber;
    }
  }
  return {...gameStatus};
}