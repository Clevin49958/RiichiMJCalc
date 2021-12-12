
interface Player {
    name: string,
    // 0: East, 1:South, 2: West, 3: North
    seating:number,
    score: number,
    lastScore?: number,
}

type PlayerTable = [Player, Player, Player, Player];

interface GameStatus {
    wind: number,
    honba: number,
    players: PlayerTable,
}

function PlayerInfoCell(
    player: Player
) {
    return <>
        <span>{player.name}</span>
        <br />
        <span>{player.score}</span>
    </>;
}

function PlayerTable({
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

export {}