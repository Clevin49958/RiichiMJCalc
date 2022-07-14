import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { includes, maxBy, omit, pick } from "lodash";

import PlayerTable from "./components/PlayerTable";
import { PlayerList, Player } from "./types/Player";
import { getWind, WindNumber } from "./util/Wind";
import { incrementRound } from "./util/GameStatus";
import { GameStatus } from "./types/GameStatus";
import {
  applyScoreChange,
  getDealer,
  getDeltaWithoutWinner,
  getDeltaWithWinner,
} from "./util/Score";
import { HonbaStick, RichiiStick } from "./Icons";
import { Record } from "./types/Record";
import RoundHistory from "./components/RoundHistory";
import { GameEntrySelector } from "./components/GameEntrySelector";
import GameContext from "./context/GameContext";
import FinalPoints from "./components/FinalPoints";
import { PointsPlot } from "./components/PointsPlot";
import { DEFAULT_WIN_INFO, StickIconSize } from "./util/Constants";
import { useGameManager } from "./hooks/useGameManager";
import { useToggle } from "./hooks/useToggle";
import { ResultInputContext } from "./context/ResultInputContext";

export function GameStatusCenterCell(gameStatus: GameStatus) {
  /** Display Current field wind and honba */
  return (
    <div className="no-select" style={{ textAlign: "center" }}>
      {`${getWind(gameStatus.wind)} ${gameStatus.round}`} <br />
      {`${gameStatus.honba}`} {HonbaStick(StickIconSize)}
      <br />
      {`${gameStatus.richiiStick}`} {RichiiStick(StickIconSize)}
    </div>
  );
}
export function Calculator({
  viewOnly,
  onNextGame,
}: {
  viewOnly: boolean;
  onNextGame: (names: string[]) => void;
}) {
  // Game state objects
  const {
    gameStatus,
    setGameStatus,
    players,
    setPlayers,
    records: gameRecord,
    setRecords: setGameRecord,
  } = useContext(GameContext);
  const n = gameStatus.numPlayers;

  // New result input
  const { winInfo, setWinInfo, tenpai, setTenpai, endingType, setEndingType } =
    useContext(ResultInputContext);

  const { togglePlayerRichii } = useGameManager();

  const pushRecord = (record: Record) => {
    setGameRecord([...gameRecord, record]);
  };
  const resetWinState = () => {
    setWinInfo(DEFAULT_WIN_INFO(gameStatus));
    setTenpai(Array(n).fill(false));
    setEndingType("Win");
  };

  // Display
  const [displayDelta, setDisplayDelta] = useState(-1);
  const [tabletopMode, toggleTabletopMode] = useToggle(false);
  const orientation = tabletopMode ? displayDelta : -1;

  const playersScoreView = players.map((player) => ({
    ...player,
  })) as PlayerList;
  if (displayDelta >= 0) {
    playersScoreView.forEach((player, wind) => {
      if (wind !== displayDelta) {
        player.score -= players[displayDelta].score;
      }
    });
  }

  // Rewind
  const rewind = useCallback(() => {
    const newRecords = [...gameRecord];
    const lastRecord = newRecords.pop();
    if (lastRecord === undefined) {
      // Rewind triggered when no game has been played yet
      return;
    }

    setPlayers((players) =>
      applyScoreChange(
        players,
        lastRecord.deltas.map(
          (delta, index) => (gameStatus.richii[index] ? 1000 : 0) - delta
        )
      )
    );
    setGameStatus((gameStatus) => ({
      numPlayers: gameStatus.numPlayers,
      ...pick(lastRecord, "wind", "round", "honba", "richiiStick"),
      richii: [...lastRecord.richii],
    }));
    setGameRecord(newRecords);
  }, [gameRecord, setPlayers, setGameStatus, setGameRecord, gameStatus.richii]);

  const saveEntry = () => {
    let deltas: number[];
    if (endingType === "Win") {
      deltas = getDeltaWithWinner(winInfo, gameStatus);
    } else {
      deltas = getDeltaWithoutWinner(tenpai);
    }
    setPlayers((players) => applyScoreChange(players, deltas));
    const record: Omit<Record, "info" | "type"> = {
      deltas,
      ...omit(gameStatus, "numPlayers"),
    };
    if (endingType === "Win") {
      pushRecord({
        ...record,
        type: endingType,
        info: winInfo,
      });
    } else {
      pushRecord({
        ...record,
        type: endingType,
        info: {
          tenpai,
        },
      });
    }

    setGameStatus(
      nextGameStatus(
        endingType === "Win" ? winInfo.map((record) => record.winner) : null,
        tenpai[getDealer(gameStatus)],
        gameStatus
      )
    );
    resetWinState();
  };

  const PlayerInfoCell = useCallback(
    (player: Player) => {
      const richii = gameStatus.richii;
      const hasRichii = richii[player.seating];

      const angle =
        4 -
        (tabletopMode
          ? orientation === -1
            ? player.seating
            : orientation
          : 4);
      return (
        <div
          className={`d-flex flex-column p-0 no-select justify-content-center align-items-center ${
            tabletopMode ? "" : "m-3"
          }`}
          style={{
            transform: `rotate(${angle * 90}deg)`,
            height: tabletopMode ? "33.3vh" : undefined,
            width: tabletopMode
              ? angle % 2 === 1
                ? "33.3vh"
                : "33.3vw"
              : undefined,
          }}
        >
          <div
            className="mb-2"
            onMouseDown={() => setDisplayDelta(player.seating)}
            onTouchStart={() => setDisplayDelta(player.seating)}
            onMouseUp={() => setDisplayDelta(-1)}
            onTouchEnd={() => setDisplayDelta(-1)}
          >
            <span
              className={`${tabletopMode ? "fs-1" : ""}`}
              style={{
                color: getDealer(gameStatus) === player.seating ? "red" : "",
              }}
            >
              {player.name}
            </span>
            <br />
            <span className={`${tabletopMode ? "fs-1" : ""}`}>
              {player.score}
            </span>
          </div>
          <button
            aria-label="Richii"
            type="button"
            style={{
              backgroundColor: hasRichii ? "transparent" : "",
              width: tabletopMode ? "50%" : undefined,
            }}
            className={`btn ${hasRichii ? "p-0" : "btn-primary"} ${
              tabletopMode ? "" : "btn-sm"
            } border-0`}
            onClick={() => togglePlayerRichii(player.seating, !hasRichii)}
          >
            {hasRichii ? RichiiStick(StickIconSize) : <span>Richii!</span>}
          </button>
        </div>
      );
    },
    [gameStatus, orientation, tabletopMode, togglePlayerRichii]
  );

  const rewindButton = useMemo(
    () => (
      <button
        type="button"
        aria-label="rewind"
        className="btn btn-primary"
        disabled={!gameRecord.length}
        onClick={rewind}
      >
        Rewind
      </button>
    ),
    [rewind]
  );

  const toggleTabletopModeButton = useMemo(
    () => (
      <button
        type="button"
        aria-label="switch tabletop mode"
        className="btn btn-light"
        onClick={toggleTabletopMode}
      >
        {tabletopMode ? "Tabletop mode" : "Display mode"}
      </button>
    ),
    [toggleTabletopMode, tabletopMode]
  );

  const onNextGameMemo = useCallback(() => {
    const highestPlayerIndex = (
      maxBy(players, (player) => player.score) ?? players[0]
    ).seating;
    const newPlayerNames = players.map(
      (_player, idx, players) => players[(idx + highestPlayerIndex) % n].name
    );
    onNextGame(newPlayerNames);
  }, [n, onNextGame, players]);

  return (
    <div className={`p-0 container${tabletopMode ? "-fluid" : ""}`}>
      <div className="d-flex flex-column">
        <PlayerTable
          playerTable={playersScoreView}
          playerCell={PlayerInfoCell}
          centerCell={() => GameStatusCenterCell(gameStatus)}
          RBCell={rewindButton}
          LTCell={toggleTabletopModeButton}
          tableTopMode={tabletopMode}
        />
        {!tabletopMode && (
          <>
            {viewOnly || (
              <div className="row">
                <div className="col col-12">
                  <GameEntrySelector
                    endingType={endingType}
                    setEndingType={setEndingType}
                    players={players}
                    winInfo={winInfo}
                    setWinInfo={setWinInfo}
                    tenpai={tenpai}
                    setTenpai={setTenpai}
                    saveEntry={saveEntry}
                    isReady={true}
                    onNextGame={onNextGameMemo}
                  />
                </div>
              </div>
            )}
            <RoundHistory records={gameRecord} players={players} />
            <FinalPoints />
            <PointsPlot
              players={players}
              gameRecord={gameRecord}
              gameStatus={gameStatus}
            />
          </>
        )}
      </div>
    </div>
  );
}

export function nextGameStatus(
  winner: null | WindNumber[],
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
    if (includes(winner, getDealer(gameStatus))) {
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
