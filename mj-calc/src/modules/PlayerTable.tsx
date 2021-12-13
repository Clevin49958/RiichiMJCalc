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
                <div className="col col-4"></div>
                <div className="col col-4 align-self-center">
                    {/* West */}
                    {playerCell(playerTable[2])}
                </div>
                <div className="col col-4"></div>
            </div>
            <div className="row">
                <div className="col col-4">
                    {/* North */}
                    {playerCell(playerTable[3])}
                </div>
                <div className="col col-4">
                    {/* Center */}
                    {centerCell()}
                </div>
                <div className="col col-4">
                    {/* South */}
                    {playerCell(playerTable[1])}
                </div>
            </div>
            <div className="row">
                <div className="col col-4"></div>
                <div className="col col-4 align-self-center">
                    {/* East */}
                    {playerCell(playerTable[0])}
                </div>
                <div className="col col-4"></div>
            </div>
        </div>
    </>;
}
