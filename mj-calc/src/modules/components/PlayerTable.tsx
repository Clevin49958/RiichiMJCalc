import { HTMLAttributes, useMemo } from "react";
import { Player } from "../types/Player";
import { WindNumber } from "../util/Wind";

export default function PlayerTable<T = Player>({
  playerTable,
  playerCell,
  centerCell,
  LTCell = <></>,
  RTCell = <></>,
  LBCell = <></>,
  RBCell = <></>,
  tableTopMode,
}: {
  playerTable: T[];
  playerCell: (player: T, seating: WindNumber, players: T[]) => JSX.Element;
  centerCell: () => JSX.Element;
  LTCell?: JSX.Element;
  RTCell?: JSX.Element;
  LBCell?: JSX.Element;
  RBCell?: JSX.Element;
  tableTopMode?: boolean;
}) {
  const rowStyle: HTMLAttributes<HTMLDivElement>["style"] = useMemo(
    () =>
      tableTopMode
        ? {
            height: "33.3vh",
            overflow: "hidden",
          }
        : undefined,
    [tableTopMode]
  );
  return (
    <>
      <div
        className="player-table container-fluid p-0 "
        style={{
          height: tableTopMode ? "100vw" : undefined,
          position: tableTopMode ? "fixed" : undefined,
          top: tableTopMode ? 0 : undefined,
          maxHeight: tableTopMode ? undefined : "500px",
        }}
      >
        <div className="row" style={rowStyle}>
          <div className="col col-4 p-0 player-table-cell corner-cell d-flex align-items-center justify-content-center">
            {LTCell}
          </div>
          <div className="col col-4 p-0 player-table-cell player-cell d-flex align-items-center justify-content-center">
            {/* West */}
            {playerTable.length >= 3 &&
              playerCell(playerTable[2], 2, playerTable)}
          </div>
          <div className="col col-4 p-0 player-table-cell corner-cell d-flex align-items-center justify-content-center">
            {RTCell}
          </div>
        </div>
        <div className="row" style={rowStyle}>
          <div className="col col-4 p-0 player-table-cell player-cell d-flex align-items-center justify-content-center">
            {/* North */}
            {playerTable.length >= 4 &&
              playerCell(playerTable[3], 3, playerTable)}
          </div>
          <div className="col col-4 p-0 player-table-cell center-cell d-flex align-items-center justify-content-center">
            {/* Center */}
            {centerCell()}
          </div>
          <div className="col col-4 p-0 player-table-cell player-cell d-flex align-items-center justify-content-center">
            {/* South */}
            {playerCell(playerTable[1], 1, playerTable)}
          </div>
        </div>
        <div className="row" style={rowStyle}>
          <div className="col col-4 p-0 player-table-cell corner-cell d-flex align-items-center justify-content-center">
            {LBCell}
          </div>
          <div className="col col-4 p-0 player-table-cell player-cell d-flex align-items-center justify-content-center">
            {/* East */}
            {playerCell(playerTable[0], 0, playerTable)}
          </div>
          <div className="col col-4 p-0 player-table-cell corner-cell d-flex align-items-center justify-content-center">
            {RBCell}
          </div>
        </div>
      </div>
    </>
  );
}
