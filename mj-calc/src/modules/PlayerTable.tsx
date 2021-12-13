import { WindNumber } from "./util/Wind";

export interface IPlayer {
    name: string,
    seating:WindNumber,
    score: number,
    lastScore?: number,
}

export type IPlayerTable = [IPlayer, IPlayer, IPlayer, IPlayer];

export default function PlayerTable({
    playerTable,
    playerCell,
    centerCell,
} : {
    playerTable: IPlayerTable,
    playerCell: (player: IPlayer) =>  JSX.Element,
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
