import React from "@prisma/client";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { GameSummary } from "../types/Game";

export default function GameList({ games }: { games: GameSummary[] }) {
  const { t } = useTranslation("common");
  return (
    <>
      <h1 className="my-4" style={{ textAlign: "center" }}>
        {t("game.history")}
      </h1>
      <div className="card-column my-2">
        {games.map((game) => (
          <div className="card" key={game.id}>
            <div className="card-body">
              <h5 className="card-header">
                <Link href={`/games/${game.id}`}>
                  {game.endTime.toLocaleString()}
                </Link>
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
                          {t("util.ranking", { count: idx + 1, ordinal: true })}{" "}
                          {player.name}
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
    </>
  );
}
