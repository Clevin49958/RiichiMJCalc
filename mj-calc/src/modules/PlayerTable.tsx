import { IPlayer } from "./util/IPlayer";
import { WindNumber } from "./util/Wind";

export default function PlayerTable<T = IPlayer>({
  playerTable,
  playerCell,
  centerCell,
  LTCell = <></>,
  RTCell = <></>,
  LBCell = <></>,
  RBCell = <></>,
}: {
  playerTable: T[];
  playerCell: (player: T, seating: WindNumber, players: T[]) => JSX.Element;
  centerCell: () => JSX.Element;
  LTCell?: JSX.Element;
  RTCell?: JSX.Element;
  LBCell?: JSX.Element;
  RBCell?: JSX.Element;
}) {
  return (
    <>
      <div
        className="player-table container-fluid my-2"
        style={{ maxWidth: "500px" }}
      >
        <div className="row">
          <div className="col col-4 p-2 player-table-cell">{LTCell}</div>
          <div className="col col-4 p-2 player-table-cell player-cell">
            {/* West */}
            {playerTable.length >= 3 &&
              playerCell(playerTable[2], 2, playerTable)}
          </div>
          <div className="col col-4 p-2 player-table-cell">{RTCell}</div>
        </div>
        <div className="row">
          <div className="col col-4 p-2 player-table-cell player-cell">
            {/* North */}
            {playerTable.length >= 4 &&
              playerCell(playerTable[3], 3, playerTable)}
          </div>
          <div className="col col-4 p-2 player-table-cell center-cell">
            {/* Center */}
            {centerCell()}
          </div>
          <div className="col col-4 p-2 player-table-cell player-cell">
            {/* South */}
            {playerCell(playerTable[1], 1, playerTable)}
          </div>
        </div>
        <div className="row">
          <div className="col col-4 p-2 player-table-cell">{LBCell}</div>
          <div className="col col-4 p-2 player-table-cell player-cell">
            {/* East */}
            {playerCell(playerTable[0], 0, playerTable)}
          </div>
          <div className="col col-4 p-2 player-table-cell ">{RBCell}</div>
        </div>
      </div>
    </>
  );
}
