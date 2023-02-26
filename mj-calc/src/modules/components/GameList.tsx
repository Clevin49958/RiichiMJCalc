import React, { Game, GameSetting, Player } from "@prisma/client";

export default function GameList({
  games,
}: {
  games: (Game & {
    gameSetting: GameSetting | null;
    players: Player[];
  })[];
}) {
  return (
    <div className="card-column my-2">
      {games.map((game) => (
        <div className="card" key={game.id}>
          <div className="card-body">
            <h5 className="card-header">
              <a href={`/game/${game.id}`}>{`Game on ${game.endTime}`}</a>
            </h5>
            <div className="container round-entry">
              <div className="row">
                {[...game.players]
                  .sort((a, b) => b.score - a.score)
                  .map((player, idx) => (
                    <>
                      <div
                        className="col col-6 col-sm-3"
                        key={`${player.seating}-name`}
                      >
                        {`${idx + 1}位 ${player.name}`}
                      </div>
                      <div
                        className="col col-6 col-sm-3"
                        key={`${player.seating}-score`}
                      >
                        {player.score}
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
