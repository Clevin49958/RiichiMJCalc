import React, { useState } from "react";
import PlayerTable from "./PlayerTable";
import { IPlayerTable, IPlayer } from "./util/IPlayer";
import { getWind, NP, WindNumber } from "./util/Wind";
import { GameStatus, incrementRound, IRichii } from "./util/GameStatus";
import {
  applyScoreChange,
  getDealer,
  getDeltaWithoutWinner,
  getDeltaWithWinner,
} from "./util/Score";
import { HonbaStick, RichiiStick } from "./Icons";
import { DrawRecord, IRecord, WinRecord } from "./util/IRecord";
import RoundHistory from "./RoundHistory";
import Header from "./Header";

const STARTING_POINT = 25000;
const STARTING_WIND = 0;
const STARTING_HONBA = 0;
export const StickIconSize = { width: 56, height: 18 };

const DEFAULT_FAN = 3;
const DEFAULT_FU = 30;
const DEFAULT_PLAYER = (gameStatus: GameStatus) => {
  return getDealer(gameStatus);
};

export function GameStatusCenterCell(gameStatus: GameStatus) {
  /** Display Current field wind and honba */
  return (
    <div style={{ textAlign: "center" }}>
      {`${getWind(gameStatus.wind)} ${gameStatus.round}`} <br />
      {`${gameStatus.honba}`} {HonbaStick(StickIconSize)}
      <br />
      {`${gameStatus.richiiStick}`} {RichiiStick(StickIconSize)}
    </div>
  );
}
export function DropdownEntry<T extends string | number>({
  label,
  keys,
  values,
  setter,
  value,
  cast,
  defaultValue,
}: {
  label: string;
  keys: string[] | number[];
  values: T[];
  value: T | null;
  setter: (t: T) => void;
  cast: (value: string) => T;
  defaultValue: T;
}) {
  return (
    <div>
      <span>{label}: </span>
      <select
        className="form-select"
        aria-label={`Select ${label}`}
        onChange={(e) => setter(cast(e.target.value))}
      >
        {/* <option selected={value === null}>{label}</option> */}
        {keys.map((key, index) => {
          const currValue = values[index];
          let isSelected: boolean;
          if (value === null) {
            isSelected = currValue === defaultValue;
          } else {
            isSelected = value === currValue;
          }

          return (
            <option key={key} selected={isSelected} value={currValue}>
              {key}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function CalculatorCore({
  n,
  playerNames,
}: {
  n: NP;
  playerNames: string[];
}) {
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    numPlayers: n,
    wind: STARTING_WIND,
    round: 1,
    honba: STARTING_HONBA,
    richiiStick: 0,
    richii: Array(n).fill(false),
  });

  const [players, setPlayers] = useState<IPlayerTable>(
    (Array.from(Array(n).keys()) as WindNumber[]).map((seating) => ({
      name: playerNames[seating],
      seating: seating,
      score: STARTING_POINT,
    })) as IPlayerTable,
  );

  const [fan, setFan] = useState<number | null>(DEFAULT_FAN);
  const [fu, setFu] = useState<number | null>(DEFAULT_FU);
  const [winner, setWinner] = useState<WindNumber | null>(
    DEFAULT_PLAYER(gameStatus),
  );
  const [dealIn, setDealIn] = useState<WindNumber | null>(
    DEFAULT_PLAYER(gameStatus),
  );
  const [tenpai, setTenpai] = useState(Array(n).fill(false));
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");
  const [gameRecord, setGameRecord] = useState<IRecord[]>([]);

  const pushRecord = (record: IRecord) => {
    setGameRecord([...gameRecord, record]);
  };

  const [displayDelta, setDisplayDelta] = useState(-1);

  const playersScoreView = players.map((player) => ({
    ...player,
  })) as IPlayerTable;
  if (displayDelta >= 0) {
    playersScoreView.forEach((player, wind) => {
      if (wind !== displayDelta) {
        player.score -= players[displayDelta].score;
      }
    });
  }
  const isReady = true;
  // const isReady = endingType === "Draw" || (
  //   fan !== null && fu !== null && winner !== null && dealIn !== null
  // )

  const GameContext = React.createContext({
    gameStatus,
    players,
    setGameStatus,
    setPlayers,
  });

  const resetWinState = () => {
    setFan(DEFAULT_FAN);
    setFu(DEFAULT_FU);
    setWinner(DEFAULT_PLAYER(gameStatus));
    setDealIn(DEFAULT_PLAYER(gameStatus));
    setTenpai(Array(n).fill(false));
    setEndingType("Win");
  };

  const saveEntry = () => {
    let deltas: number[];
    if (endingType === "Win") {
      deltas = getDeltaWithWinner(
        fan!,
        fu!,
        winner === dealIn,
        winner!,
        gameStatus,
        dealIn!,
      );
    } else {
      deltas = getDeltaWithoutWinner(tenpai);
    }
    console.log(deltas);
    applyScoreChange(players, deltas);
    setPlayers([...players]);
    pushRecord({
      type: endingType,
      deltas: deltas,
      wind: gameStatus.wind,
      round: gameStatus.round,
      honba: gameStatus.honba,
      info:
        endingType === "Win"
          ? ({
              winner: winner,
              dealIn: dealIn,
            } as WinRecord)
          : ({
              tenpai: tenpai,
            } as DrawRecord),
    });
    setGameStatus(nextGameStatus(winner, false, gameStatus));
    resetWinState();
  };

  function flipPlayerRichii(seating: WindNumber) {
    const newRichiiList = [...gameStatus.richii] as IRichii;

    newRichiiList[seating] = !newRichiiList[seating];
    gameStatus.richiiStick += newRichiiList[seating] ? 1 : -1;

    const newPlayers = [...players] as IPlayerTable;
    newPlayers[seating].score -= newRichiiList[seating] ? 1000 : -1000;
    setGameStatus({
      ...gameStatus,
      richii: newRichiiList,
    });
  }

  function PlayerInfoCell(player: IPlayer) {
    const richii = gameStatus.richii;
    const hasRichii = richii[player.seating];
    return (
      <div className="container">
        <div className="row mb-2">
          <div
            className="col"
            onMouseDown={() => setDisplayDelta(player.seating)}
            onTouchStart={() => setDisplayDelta(player.seating)}
            onMouseUp={() => setDisplayDelta(-1)}
            onTouchEnd={() => setDisplayDelta(-1)}
          >
            <span
              style={{
                color: getDealer(gameStatus) === player.seating ? "red" : "",
                fontSize: "20px",
              }}
            >
              {player.name}
            </span>
            <br />
            <span>{player.score}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              aria-label="Richii"
              type="button"
              style={{ backgroundColor: hasRichii ? "transparent" : "" }}
              className={`btn ${hasRichii ? "p-0" : "btn-primary"}  border-0`}
              onClick={() => flipPlayerRichii(player.seating)}
            >
              {hasRichii ? RichiiStick(StickIconSize) : <span>Richii!</span>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Page = () => {
    const fans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
    return (
      <React.Fragment>
        <div className="row">
          <PlayerTable
            playerTable={playersScoreView}
            playerCell={PlayerInfoCell}
            centerCell={() => GameStatusCenterCell(gameStatus)}
          />
        </div>
        <div className="row">
          <div className="col col-12">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${
                    endingType === "Win" ? "active" : ""
                  }`}
                  id="nav-win-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-win"
                  type="button"
                  role="tab"
                  aria-controls="nav-win"
                  aria-selected="true"
                  onClick={() => setEndingType("Win")}
                >
                  Win
                </button>
                <button
                  className={`nav-link ${
                    endingType === "Draw" ? "active" : ""
                  }`}
                  id="nav-draw-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-draw"
                  type="button"
                  role="tab"
                  aria-controls="nav-draw"
                  aria-selected="false"
                  onClick={() => setEndingType("Draw")}
                >
                  Draw
                </button>
                {/* <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button> */}
              </div>
            </nav>
            <div className="tab-content mt-1" id="nav-tabContent">
              <div
                className={`tab-pane fade ${
                  endingType === "Win" ? "show active" : ""
                }`}
                id="nav-win"
                role="tabpanel"
                aria-labelledby="nav-win-tab"
              >
                <div className="d-flex flex-row flex-wrap">
                  <DropdownEntry
                    label="Fan"
                    keys={fans}
                    values={fans}
                    value={fan}
                    setter={(v) => setFan(v)}
                    cast={parseInt}
                    defaultValue={2}
                  />

                  <DropdownEntry
                    label="Fu"
                    keys={fus}
                    values={fus}
                    value={fu}
                    setter={(v) => setFu(v)}
                    cast={parseInt}
                    defaultValue={30}
                  />

                  <DropdownEntry
                    label="Winner"
                    keys={players.map((p) => p.name)}
                    values={players.map((p) => p.seating)}
                    value={winner}
                    setter={(v) => setWinner(v as WindNumber)}
                    cast={parseInt}
                    defaultValue={getDealer(gameStatus)}
                  />

                  <DropdownEntry
                    label="Deal in"
                    keys={players.map((p) =>
                      p.seating === winner ? "Tsumo" : p.name,
                    )}
                    values={players.map((p) => p.seating)}
                    value={dealIn}
                    setter={(v) => setDealIn(v as WindNumber)}
                    cast={parseInt}
                    defaultValue={getDealer(gameStatus)}
                  />
                </div>
              </div>

              <div
                className={`tab-pane fade ${
                  endingType === "Draw" ? "show active" : ""
                }`}
                id="nav-draw"
                role="tabpanel"
                aria-labelledby="nav-draw-tab"
              >
                <PlayerTable
                  playerTable={players}
                  playerCell={function (player: IPlayer): JSX.Element {
                    const id = `tenpai-check-${player.seating}`;
                    return (
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={id}
                          checked={tenpai[player.seating]}
                          onChange={(_) => {
                            const newTenpai = [...tenpai];
                            newTenpai[player.seating] =
                              !newTenpai[player.seating];
                            setTenpai(newTenpai);
                          }}
                        />
                        <label className="form-check-label" htmlFor={id}>
                          {player.name}
                        </label>
                      </div>
                    );
                  }}
                  centerCell={function (): JSX.Element {
                    return (
                      <>
                        <span>Check all players that were tenpai.</span>
                      </>
                    );
                  }}
                />
              </div>
              <button
                className="btn btn-primary mt-3"
                type="button"
                onClick={() => {
                  saveEntry();
                }}
                disabled={!isReady}
              >
                Save entry
              </button>
            </div>
          </div>
        </div>
        <RoundHistory records={gameRecord} players={players} />
      </React.Fragment>
    );
  };

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        players,
        setGameStatus,
        setPlayers,
      }}
    >
      <div className="container">
        {/* <Header /> */}
        <Page />
      </div>
    </GameContext.Provider>
  );
}

export function nextGameStatus(
  winner: null | WindNumber,
  isDealerTenpai: boolean,
  gameStatus: GameStatus,
) {
  // update honba
  if (winner === null) {
    gameStatus.honba += 1;
    if (!isDealerTenpai) {
      incrementRound(gameStatus);
    }
  } else {
    if (winner === getDealer(gameStatus)) {
      gameStatus.honba += 1;
    } else {
      incrementRound(gameStatus);
      gameStatus.honba = 0;
    }
    gameStatus.richiiStick = 0;
    console.log("%s %d", winner, gameStatus.richiiStick);
  }
  // update richii state
  gameStatus.richii = Array(gameStatus.numPlayers).fill(false);

  return { ...gameStatus };
}
