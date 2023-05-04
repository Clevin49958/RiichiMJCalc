import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line import/no-extraneous-dependencies
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";
import { PlayerList, Player } from "../types/Player";
import { WindNumber } from "../util/Wind";
import { EndingType, WinRecord } from "../types/Record";
import { DEFAULT_WIN_INFO } from "../util/Constants";

import PlayerTable from "./PlayerTable";
import DropdownEntry from "./DropdownEntry";
import { ExportResult } from "./SaveResult";

interface GameEntrySelectorProps {
  endingType: string;
  setEndingType: Dispatch<SetStateAction<EndingType>>;
  players: PlayerList;
  winInfo: WinRecord[];
  setWinInfo: Dispatch<SetStateAction<WinRecord[]>>;
  tenpai: boolean[];
  setTenpai: Dispatch<SetStateAction<boolean[]>>;
}

interface SaveRoundProps {
  endingType: string;
  setEndingType: Dispatch<SetStateAction<EndingType>>;
  players: PlayerList;
  winInfo: WinRecord[];
  setWinInfo: Dispatch<SetStateAction<WinRecord[]>>;
  tenpai: boolean[];
  setTenpai: Dispatch<SetStateAction<boolean[]>>;
  saveEntry: () => void;
  onNextGame: () => void;
  isReady: boolean;
}
export function GameEntrySelector({
  endingType,
  setEndingType,
  players,
  winInfo,
  setWinInfo,
  tenpai,
  setTenpai,
}: GameEntrySelectorProps) {
  const { t } = useTranslation("common");
  const fans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 26, 39, 52, 65, 78];
  const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

  const [setFan, setFu, setWinner, setDealIn] = useMemo(() => {
    const setFan = (fan: number, idx: number) =>
      setWinInfo((winInfo) => {
        const newInfo = [...winInfo];
        newInfo[idx] = {
          ...newInfo[idx],
          fan,
        };
        return newInfo;
      });
    const setFu = (fu: number, idx: number) =>
      setWinInfo((winInfo) => {
        const newInfo = [...winInfo];
        newInfo[idx] = {
          ...newInfo[idx],
          fu,
        };
        return newInfo;
      });
    const setWinner = (winner: WindNumber, idx: number) =>
      setWinInfo((winInfo) => {
        const newInfo = [...winInfo];
        newInfo[idx] = {
          ...newInfo[idx],
          winner,
        };
        return newInfo;
      });
    const setDealIn = (dealIn: WindNumber, _idx: number) =>
      setWinInfo((winInfo) =>
        winInfo.map((info) => ({
          ...info,
          dealIn,
        }))
      );
    return [setFan, setFu, setWinner, setDealIn];
  }, [setWinInfo]);

  const PlayerCell = useCallback(
    (player: Player) => (
      <div className="form-check">
        <label className="form-check-label">
          {player.name}
          <input
            className="form-check-input"
            type="checkbox"
            checked={tenpai[player.seating]}
            onChange={(_) => {
              const newTenpai = [...tenpai];
              newTenpai[player.seating] = !newTenpai[player.seating];
              setTenpai(newTenpai);
            }}
          />
        </label>
      </div>
    ),
    [setTenpai, tenpai]
  );

  const CenterCell = useCallback(
    () => <span>{t("prompt.tenpaiEntry")}</span>,
    [t]
  );

  return (
    <>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className={`nav-link ${endingType === "Win" ? "active" : ""}`}
            id="nav-win-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-win"
            type="button"
            role="tab"
            aria-controls="nav-win"
            aria-selected="true"
            onClick={() => setEndingType("Win")}
          >
            {t("jargon.win")}
          </button>
          <button
            className={`nav-link ${endingType === "Draw" ? "active" : ""}`}
            id="nav-draw-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-draw"
            type="button"
            role="tab"
            aria-controls="nav-draw"
            aria-selected="false"
            onClick={() => setEndingType("Draw")}
          >
            {t("jargon.draw")}
          </button>
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
          {winInfo.map((info, idx) => (
            <div
              className="d-flex flex-row flex-wrap align-item-end"
              key={info.winner}
            >
              <DropdownEntry
                label={t("jargon.fan")}
                labels={fans.map((fan) => {
                  if (fan % 13 === 0) {
                    return t(`jargon.yakuman_${fan / 13}`);
                  }
                  return fan.toString();
                })}
                values={fans}
                value={info.fan}
                setter={(fan) => setFan(fan, idx)}
              />

              <DropdownEntry
                label={t("jargon.fu")}
                labels={fus}
                values={fus}
                value={info.fu}
                setter={(fu) => setFu(fu, idx)}
              />

              <DropdownEntry
                label={t("jargon.winner")}
                labels={players.map((p) => p.name)}
                values={players.map((p) => p.seating)}
                value={info.winner}
                setter={(v) => setWinner(v as WindNumber, idx)}
              />

              {idx === 0 && (
                <DropdownEntry
                  label={t("jargon.dealIn")}
                  labels={players.map((p) =>
                    p.seating === winInfo[0].winner ? t("jargon.tsumo") : p.name
                  )}
                  values={players.map((p) => p.seating)}
                  value={info.dealIn}
                  setter={(v) => setDealIn(v as WindNumber, idx)}
                />
              )}

              {idx === 0 && winInfo.length <= 2 && (
                <button
                  type="button"
                  className="btn btn-sm btn-info text-white mt-4 ms-2"
                  onClick={() =>
                    setWinInfo([
                      ...winInfo,
                      {
                        ...DEFAULT_WIN_INFO,
                        dealIn: winInfo[0].dealIn,
                      },
                    ])
                  }
                >
                  {winInfo.length === 1 ? t("jargon.ron2") : t("jargon.ron3")}
                </button>
              )}
              {idx !== 0 && (
                <button
                  type="button"
                  className="btn btn-sm text-danger mt-4"
                  onClick={() =>
                    setWinInfo(winInfo.filter((_info, index) => index !== idx))
                  }
                >
                  <FontAwesomeIcon icon={faCircleXmark} />
                </button>
              )}
            </div>
          ))}
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
            playerCell={PlayerCell}
            centerCell={CenterCell}
          />
        </div>
      </div>
    </>
  );
}

export default function SaveRound({
  endingType,
  setEndingType,
  players,
  winInfo,
  setWinInfo,
  tenpai,
  setTenpai,
  saveEntry,
  isReady,
  onNextGame,
}: SaveRoundProps) {
  const { t } = useTranslation("common");
  const popover = (
    <Popover>
      <Popover.Header as="h5">{t("label.confirmation")}</Popover.Header>
      <Popover.Body>
        <p>{t("prompt.nextGameConfirm")}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          <button
            className="btn btn-success"
            type="submit"
            onClick={onNextGame}
          >
            {t("prompt.nextGameConfirmed")}
          </button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
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
          disabled={!isReady}
        >
          {t("save.kyoku")}
        </button>
        <ExportResult />
        <OverlayTrigger trigger="click" overlay={popover}>
          <button type="submit" className="btn btn-primary">
            {t("game.goNext")}
          </button>
        </OverlayTrigger>
      </div>
    </>
  );
}
