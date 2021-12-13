import { WindNumber } from "./util/Wind";

export interface Player {
    name: string,
    // 0: East, 1:South, 2: West, 3: North
    seating:WindNumber,
    score: number,
    lastScore?: number,
}

export type PlayerTable = [Player, Player, Player, Player];

export default function PlayerTable({
    playerTable,
    playerCell,
    centerCell,
} : {
    playerTable: PlayerTable,
    playerCell: (player: Player) =>  JSX.Element,
    centerCell: () => JSX.Element,
}) {
    return <>
        <div className="player-table container">
            <div className="row">
                <div className="col-4 align-self-center">
                    {/* North */}
                    {playerCell(playerTable[3])}
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    {/* West */}
                    {playerCell(playerTable[2])}
                </div>
                <div className="col-4">
                    {/* Center */}
                    {centerCell()}
                </div>
                <div className="col-4">
                    {/* East */}
                    {playerCell(playerTable[0])}
                </div>
            </div>
            <div className="row">
                <div className="col-4 align-self-center">
                    {/* South */}
                    {playerCell(playerTable[1])}
                </div>
            </div>
        </div>
    </>;
}
