import React, { Dispatch, SetStateAction, useContext, useMemo } from "react";
import PlayerTable from "./PlayerTable";
import { IPlayerTable, IPlayer } from "../util/IPlayer";
import { WindNumber } from "../util/Wind";
import { DropdownEntry } from "./DropdownEntry";
import { ExportResult } from "./SaveResult";
import { WinRecord } from "../util/IRecord";
import { DEFAULT_FAN, DEFAULT_FU, DEFAULT_PLAYER } from "../util/Constants";
import GameContext from "../util/Context";

interface GameEntrySelectorProps {
  endingType: string;
  setEndingType: Dispatch<SetStateAction<"Win" | "Draw">>;
  players: IPlayerTable;
  winInfo: WinRecord[];
  setWinInfo: Dispatch<SetStateAction<WinRecord[]>>;
  tenpai: boolean[];
  setTenpai: Dispatch<SetStateAction<boolean[]>>;
  saveEntry: () => void;
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
  saveEntry,
  isReady,
}: GameEntrySelectorProps) {
  const gameContext = useContext(GameContext);
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
    const setDealIn = (dealIn: WindNumber, idx: number) =>
      setWinInfo((winInfo) =>
        winInfo.map((info) => ({
          ...info,
          dealIn,
        }))
      );
    return [setFan, setFu, setWinner, setDealIn];
  }, [setWinInfo]);
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
            Win
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
            Draw
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
            <div className="d-flex flex-row flex-wrap align-item-end">
              <DropdownEntry
                label="Fan"
                labels={fans.map((fan) => {
                  if (fan % 13 === 0) {
                    switch (fan / 13) {
                      case 1:
                        return "Yakuman";
                      case 2:
                        return "Double Yakuman";
                      case 3:
                        return "Triple Yakuman";
                      case 4:
                        return "Quadraple Yakuman";
                      case 5:
                        return "Quintuple Yakuman";
                      case 6:
                        return "Sextuple Yakuman";
                      default:
                        return "Yakuman takusan";
                    }
                  } else {
                    return fan.toString();
                  }
                })}
                values={fans}
                value={info.fan}
                setter={(fan) => setFan(fan, idx)}
              />

              <DropdownEntry
                label="Fu"
                labels={fus}
                values={fus}
                value={info.fu}
                setter={(fu) => setFu(fu, idx)}
              />

              <DropdownEntry
                label="Winner"
                labels={players.map((p) => p.name)}
                values={players.map((p) => p.seating)}
                value={info.winner}
                setter={(v) => setWinner(v as WindNumber, idx)}
              />

              {idx === 0 && (
                <DropdownEntry
                  label="Deal in"
                  labels={players.map((p) =>
                    p.seating === winInfo[0].winner ? "Tsumo" : p.name
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
                        fan: DEFAULT_FAN,
                        fu: DEFAULT_FU,
                        winner: DEFAULT_PLAYER(gameContext.gameStatus),
                        dealIn: winInfo[0].dealIn,
                      },
                    ])
                  }
                >
                  {winInfo.length === 1 ? "Double Ron!" : "Triple Ron!"}
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
                  <i className="fa-solid fa-circle-xmark"></i>
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
                      newTenpai[player.seating] = !newTenpai[player.seating];
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
      </div>
      <div className="d-flex flex-row mt-3 justify-content-around">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            saveEntry();
          }}
          disabled={!isReady}
        >
          Save entry
        </button>
        <ExportResult />
      </div>
    </>
  );
}
