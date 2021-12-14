import { IPlayerTable, IPlayer } from "./util/IPlayer";

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
                <div className="col col-4 p-2"></div>
                <div className="col col-4 p-2 player-cell">
                    {/* West */}
                    {playerCell(playerTable[2])}
                </div>
                <div className="col col-4 p-2"></div>
            </div>
            <div className="row">
                <div className="col col-4 p-2 player-cell">
                    {/* North */}
                    {playerCell(playerTable[3])}
                </div>
                <div className="col col-4 p-2 center-cell">
                    {/* Center */}
                    {centerCell()}
                </div>
                <div className="col col-4 p-2 player-cell">
                    {/* South */}
                    {playerCell(playerTable[1])}
                </div>
            </div>
            <div className="row">
                <div className="col col-4 p-2"></div>
                <div className="col col-4 p-2 player-cell">
                    {/* East */}
                    {playerCell(playerTable[0])}
                </div>
                <div className="col col-4 p-2"></div>
            </div>
        </div>
    </>;
}
