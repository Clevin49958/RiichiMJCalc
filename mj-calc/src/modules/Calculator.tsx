import React, { useCallback, useContext, useMemo, useState } from "react";
import { maxBy } from "lodash";
import { useTranslation } from "next-i18next";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";
import PlayerTable from "./components/PlayerTable";
import { PlayerList, Player } from "./types/Player";
import { getWind } from "./util/Wind";
import { GameStatus } from "./types/GameStatus";
import { getDealer } from "./util/Score";
import { HonbaStick, RichiiStick } from "./Icons";
import RoundHistory from "./components/RoundHistory";
import SaveRound, { GameEntrySelector } from "./components/SaveRound";
import GameContext from "./context/GameContext";
import FinalPoints from "./components/FinalPoints";
import PointsPlot from "./components/PointsPlot";
import { StickIconSize, TableTopStickIconSize } from "./util/Constants";
import useGameManager from "./hooks/useGameManager";
import useToggle from "./hooks/useToggle";
import ResultInputContext from "./context/ResultInputContext";
import GameSettingContext from "./context/GameSettingContext";
import MjNavBar from "./components/MjNavBar";

export function GameStatusCenterCell(
  gameStatus: GameStatus,
  tableTopMode: boolean
) {
  const size = tableTopMode ? TableTopStickIconSize : StickIconSize;
  /** Display Current field wind and honba */
  return (
    <div
      className="no-select"
      style={{
        textAlign: "center",
        fontSize: tableTopMode ? "32px" : undefined,
      }}
    >
      {`${getWind(gameStatus.wind)} ${gameStatus.round}`} <br />
      {`${gameStatus.honba}`} {HonbaStick(size)}
      <br />
      {`${gameStatus.richiiStick}`} {RichiiStick(size)}
    </div>
  );
}
export default function Calculator({
  viewOnly,
  onNextGame,
}: {
  viewOnly: boolean;
  onNextGame: (names: string[]) => void;
}) {
  const { t } = useTranslation("common");
  // Game state objects
  const { gameStatus, players, records: gameRecord } = useContext(GameContext);
  const gameSetting = useContext(GameSettingContext);
  const { numPlayers: n } = gameSetting;

  // New result input
  const { winInfo, setWinInfo, tenpai, setTenpai, endingType, setEndingType } =
    useContext(ResultInputContext);

  const { togglePlayerRichii, rewind, saveEntry } = useGameManager();

  // // media query
  // const [matches, setMatches] = useState(
  //   window.matchMedia("(min-width: 1400px)").matches
  // );

  // useEffect(() => {
  //   window
  //     .matchMedia("(min-width: 1400px)")
  //     .addEventListener("change", (e) => setMatches(e.matches));
  // }, []);

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

  const PlayerInfoCell = useCallback(
    (player: Player) => {
      const { richii } = gameStatus;
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
            transition: "0.8s ease-in-out",
            msTransform: `rotate(${angle * 90}deg)`,
            WebkitTransform: `rotate(${angle * 90}deg)`,
            WebkitTransition: "0.8s ease-in-out",
            height: tabletopMode ? "33.3vh" : undefined,
            width: tabletopMode
              ? angle % 2 === 1
                ? "33.3vh"
                : "33.3vw"
              : undefined,
          }}
        >
          <button
            type="button"
            style={{
              background: "none",
              color: "inherit",
              border: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
              outline: "inherit",
            }}
            onMouseDown={() => setDisplayDelta(player.seating)}
            onTouchStart={() => setDisplayDelta(player.seating)}
            onMouseUp={() => setDisplayDelta(-1)}
            onTouchEnd={() => setDisplayDelta(-1)}
          >
            <span
              className={`${tabletopMode ? "fs-1" : ""}`}
              style={{
                color:
                  getDealer(gameStatus, gameSetting) === player.seating
                    ? "red"
                    : "",
              }}
            >
              {player.name}
            </span>
            <br />
            <span className={`${tabletopMode ? "fs-1" : ""}`}>
              {player.score}
            </span>
          </button>
          {!viewOnly && (
            <button
              aria-label="Richii"
              type="button"
              style={{
                backgroundColor: hasRichii ? "transparent" : "",
                width: tabletopMode ? "50%" : undefined,
              }}
              className={`btn ${hasRichii ? "p-0" : "btn-primary"} ${
                tabletopMode ? "" : "btn-sm"
              } border-0 mt-2`}
              onClick={() => togglePlayerRichii(player.seating, !hasRichii)}
            >
              {hasRichii ? (
                RichiiStick(StickIconSize)
              ) : (
                <span>{t("jargon.riichi")}</span>
              )}
            </button>
          )}
        </div>
      );
    },
    [
      gameSetting,
      gameStatus,
      orientation,
      t,
      tabletopMode,
      togglePlayerRichii,
      viewOnly,
    ]
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
        {t("game.undo")}
      </button>
    ),
    [gameRecord.length, rewind, t]
  );

  const toggleTabletopModeButton = useMemo(
    () => (
      <button
        type="button"
        aria-label="switch tabletop mode"
        className="btn btn-light"
        onClick={toggleTabletopMode}
      >
        {tabletopMode ? t("label.tabletopMode") : t("label.displayMode")}
      </button>
    ),
    [toggleTabletopMode, tabletopMode, t]
  );

  const scoreButton = ["top", "bottom"].map((position, idx) => (
    <OverlayTrigger
      trigger="click"
      placement={position as Placement}
      overlay={
        <Popover>
          <Popover.Body
            style={{
              transform: `rotate(${idx * 180}deg)`,
            }}
          >
            <GameEntrySelector
              endingType={endingType}
              setEndingType={setEndingType}
              players={players}
              winInfo={winInfo}
              setWinInfo={setWinInfo}
              tenpai={tenpai}
              setTenpai={setTenpai}
            />
            <div className="d-flex flex-row mt-3 justify-content-around">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  saveEntry();
                }}
              >
                Save entry
              </button>
            </div>
          </Popover.Body>
        </Popover>
      }
      key={position}
    >
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          transform: `rotate(${idx * 180}deg)`,
        }}
      >
        Save entry
      </button>
    </OverlayTrigger>
  ));

  const onNextGameMemo = useCallback(() => {
    const highestPlayerIndex = (
      maxBy(players, (player) => player.score) ?? players[0]
    ).seating;
    const newPlayerNames = players.map(
      (_player, idx, players) => players[(idx + highestPlayerIndex) % n].name
    );
    onNextGame(newPlayerNames);
  }, [n, onNextGame, players]);

  // // big screen grid layout
  // if (matches) {
  //   return (
  //     <div className={`p-0 container${tabletopMode ? "-fluid" : ""}`}>
  //       <div className="row">
  //         <PlayerTable
  //           playerTable={playersScoreView}
  //           playerCell={PlayerInfoCell}
  //           centerCell={() => GameStatusCenterCell(gameStatus)}
  //           RBCell={viewOnly ? undefined : rewindButton}
  //           LTCell={viewOnly ? undefined : toggleTabletopModeButton}
  //           tableTopMode={tabletopMode}
  //         />
  //         {!tabletopMode && (
  //           <div className="row mt-4">
  //             <div className="col col-6">
  //               {viewOnly || (
  //                 <GameEntrySelector
  //                   endingType={endingType}
  //                   setEndingType={setEndingType}
  //                   players={players}
  //                   winInfo={winInfo}
  //                   setWinInfo={setWinInfo}
  //                   tenpai={tenpai}
  //                   setTenpai={setTenpai}
  //                   saveEntry={saveEntry}
  //                   isReady
  //                   onNextGame={onNextGameMemo}
  //                 />
  //               )}
  //               <RoundHistory records={gameRecord} players={players} />
  //             </div>
  //             <div className="col col-6">
  //               <FinalPoints />
  //               <PointsPlot
  //                 players={players}
  //                 gameRecord={gameRecord}
  //                 gameStatus={gameStatus}
  //               />
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // small screen list layout
  return (
    <>
      {!tabletopMode && <MjNavBar />}
      <div className={`p-0 container${tabletopMode ? "-fluid" : ""}`}>
        <div className="d-flex flex-column">
          <PlayerTable
            playerTable={playersScoreView}
            playerCell={PlayerInfoCell}
            centerCell={() => GameStatusCenterCell(gameStatus, tabletopMode)}
            RBCell={viewOnly ? undefined : rewindButton}
            LTCell={viewOnly ? undefined : toggleTabletopModeButton}
            LBCell={tabletopMode ? scoreButton[0] : undefined}
            RTCell={tabletopMode ? scoreButton[1] : undefined}
            tableTopMode={tabletopMode}
          />
          {!tabletopMode && (
            <>
              {viewOnly || (
                <div className="row">
                  <div className="col col-12">
                    <SaveRound
                      endingType={endingType}
                      setEndingType={setEndingType}
                      players={players}
                      winInfo={winInfo}
                      setWinInfo={setWinInfo}
                      tenpai={tenpai}
                      setTenpai={setTenpai}
                      saveEntry={saveEntry}
                      isReady
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
    </>
  );
}
