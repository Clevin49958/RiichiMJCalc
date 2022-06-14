import React, { useRef, useState } from "react";
import PlayerTable from "./components/PlayerTable";
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
import RoundHistory from "./components/RoundHistory";
import Header from "./components/Header";
import { GameEntrySelector } from "./components/GameEntrySelector";
import GameContext from "./util/Context";
import FinalPoints from "./components/FinalPoints";
import IGame from "./util/IGame";
import { PointsPlot } from "./components/PointsPlot";
import {
  STARTING_HONBA,
  STARTING_POINT,
  STARTING_WIND,
  DEFAULT_FAN,
  DEFAULT_FU,
  DEFAULT_PLAYER,
  StickIconSize,
} from "./util/Constants";

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
export function CalculatorCore({
  n,
  playerNames,
  viewOnly,
  state = null,
}: {
  n: NP;
  playerNames: string[];
  viewOnly: boolean;
  state: IGame | null;
}) {
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    state?.gameStatus ?? {
      numPlayers: n,
      wind: STARTING_WIND,
      round: 1,
      honba: STARTING_HONBA,
      richiiStick: 0,
      richii: Array(n).fill(false),
    }
  );

  const prevGameStatus = useRef<GameStatus | undefined>();
  const startingPoint = STARTING_POINT[4 - n];
  const [players, setPlayers] = useState<IPlayerTable>(
    state?.players ??
      ((Array.from(Array(n).keys()) as WindNumber[]).map((seating) => ({
        name: playerNames[seating],
        seating: seating,
        score: startingPoint,
      })) as IPlayerTable)
  );

  const [fan, setFan] = useState<number>(DEFAULT_FAN);
  const [fu, setFu] = useState<number>(DEFAULT_FU);
  const [winner, setWinner] = useState<WindNumber>(DEFAULT_PLAYER(gameStatus));
  const [dealIn, setDealIn] = useState<WindNumber>(DEFAULT_PLAYER(gameStatus));
  const [tenpai, setTenpai] = useState<boolean[]>(Array(n).fill(false));
  const [endingType, setEndingType] = useState<"Win" | "Draw">("Win");
  const [gameRecord, setGameRecord] = useState<IRecord[]>(state?.records ?? []);

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

  const resetWinState = () => {
    setFan(DEFAULT_FAN);
    setFu(DEFAULT_FU);
    setWinner(DEFAULT_PLAYER(gameStatus));
    setDealIn(DEFAULT_PLAYER(gameStatus));
    setTenpai(Array(n).fill(false));
    setEndingType("Win");
  };

  const saveEntry = () => {
    prevGameStatus.current = {
      ...gameStatus,
    };
    let deltas: number[];
    if (endingType === "Win") {
      deltas = getDeltaWithWinner(
        fan,
        fu,
        winner === dealIn,
        winner,
        gameStatus,
        dealIn
      );
    } else {
      deltas = getDeltaWithoutWinner(tenpai);
    }
    applyScoreChange(players, deltas);
    setPlayers([...players]);
    const record: Omit<IRecord, "info" | "type"> = {
      deltas: deltas,
      wind: gameStatus.wind,
      round: gameStatus.round,
      honba: gameStatus.honba,
    };
    if (endingType === "Win") {
      pushRecord({
        ...record,
        type: endingType,
        info: {
          winner: winner,
          dealIn: dealIn,
        },
      });
    } else {
      pushRecord({
        ...record,
        type: endingType,
        info: {
          tenpai: tenpai,
        },
      });
    }

    setGameStatus(
      nextGameStatus(
        endingType === "Win" ? winner : null,
        tenpai[getDealer(gameStatus)],
        gameStatus
      )
    );
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
      <div className="container-fluid px-0">
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

  const rewindButton = () => {
    function rewind() {
      if (!prevGameStatus.current) {
        return;
      }

      // reset player score
      players.forEach((player) => {
        player.score = player.lastScore!;
        player.lastScore = undefined;
      });

      setGameStatus({
        ...prevGameStatus.current,
      });
      prevGameStatus.current = undefined;

      setPlayers([...players]);
      gameRecord.pop();
    }
    return (
      <button
        type="button"
        aria-label="rewind"
        className="btn btn-primary"
        disabled={!prevGameStatus.current}
        onClick={rewind}
      >
        Rewind
      </button>
    );
  };

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        players,
        setGameStatus,
        setPlayers,
        records: gameRecord,
      }}
    >
      <div className="container">
        {/* <Header /> */}
        <React.Fragment>
          <div className="row">
            <div className="col col-12">
              <PlayerTable
                playerTable={playersScoreView}
                playerCell={PlayerInfoCell}
                centerCell={() => GameStatusCenterCell(gameStatus)}
                RBCell={rewindButton()}
              />
            </div>
          </div>
          {viewOnly || (
            <div className="row">
              <div className="col col-12">
                <GameEntrySelector
                  endingType={endingType}
                  setEndingType={setEndingType}
                  fan={fan}
                  setFan={setFan}
                  fu={fu}
                  setFu={setFu}
                  players={players}
                  winner={winner}
                  setWinner={setWinner}
                  dealIn={dealIn}
                  setDealIn={setDealIn}
                  tenpai={tenpai}
                  setTenpai={setTenpai}
                  saveEntry={saveEntry}
                  isReady={isReady}
                />
              </div>
            </div>
          )}
          <div className="row">
            <div className="col col-12">
              <RoundHistory records={gameRecord} players={players} />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <FinalPoints startingPoint={STARTING_POINT[4 - n]} />
            </div>
          </div>
          <div className="row">
            <div className="col col-12">
              <PointsPlot
                players={players}
                gameRecord={gameRecord}
                startingPoint={startingPoint}
                gameStatus={gameStatus}
              />
            </div>
          </div>
        </React.Fragment>
      </div>
    </GameContext.Provider>
  );
}

export function nextGameStatus(
  winner: null | WindNumber,
  isDealerTenpai: boolean,
  gameStatus: GameStatus
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
  }
  // update richii state
  gameStatus.richii = Array(gameStatus.numPlayers).fill(false);

  return { ...gameStatus };
}
