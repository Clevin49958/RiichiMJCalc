import React from "react";
import PlayerTable from "./PlayerTable";
import { IPlayerTable, IPlayer } from "./util/IPlayer";
import { WindNumber } from "./util/Wind";
import { GameStatus } from "./util/GameStatus";
import { DropdownEntry } from "./CalculatorCore";

export function GameEntrySelector(
  endingType: string,
  setEndingType: React.Dispatch<React.SetStateAction<"Win" | "Draw">>,
  fan: number,
  setFan: React.Dispatch<React.SetStateAction<number>>,
  fu: number,
  setFu: React.Dispatch<React.SetStateAction<number>>,
  players: IPlayerTable,
  winner: number,
  setWinner: React.Dispatch<React.SetStateAction<WindNumber>>,
  gameStatus: GameStatus,
  dealIn: number,
  setDealIn: React.Dispatch<React.SetStateAction<WindNumber>>,
  tenpai: boolean[],
  setTenpai: React.Dispatch<React.SetStateAction<boolean[]>>,
  saveEntry: () => void,
  isReady: boolean,
) {
  const fans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  return (
    <div className="row">
      <div className="col col-12">
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
            <div className="d-flex flex-row flex-wrap">
              <DropdownEntry
                label="Fan"
                keys={fans}
                values={fans}
                value={fan}
                setter={setFan}
              />

              <DropdownEntry
                label="Fu"
                keys={fus}
                values={fus}
                value={fu}
                setter={setFu}
              />

              <DropdownEntry
                label="Winner"
                keys={players.map((p) => p.name)}
                values={players.map((p) => p.seating)}
                value={winner}
                setter={(v) => setWinner(v as WindNumber)}
              />

              <DropdownEntry
                label="Deal in"
                keys={players.map((p) =>
                  p.seating === winner ? "Tsumo" : p.name,
                )}
                values={players.map((p) => p.seating)}
                value={dealIn}
                setter={(v) => setDealIn(v as WindNumber)}
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
  );
}
