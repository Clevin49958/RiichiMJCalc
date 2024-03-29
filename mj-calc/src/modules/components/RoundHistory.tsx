import React from "react";
import { useTranslation } from "next-i18next";
import { PlayerList } from "../types/Player";
import { DrawRecord, GameRecord } from "../types/Record";
import { getWind } from "../util/Wind";

export default function RoundHistory({
  records,
  players,
}: {
  records: GameRecord[];
  players: PlayerList;
}) {
  const { t } = useTranslation("common");
  return (
    <div className="card-column my-2">
      {[...records].reverse().map((record) => {
        let content: JSX.Element;
        if (record.type === "Win") {
          const wins = record.info;
          if (wins[0].winner === wins[0].dealIn) {
            content = (
              <div className="row">
                <div className="col col-3 win-prompt">{t("jargon.tsumo")}</div>
                <div className="col col-3">{players[wins[0].winner].name}</div>
                <div className="col col-3">{`${wins[0].fan}${t("jargon.fan")} ${
                  wins[0].fu
                }${t("jargon.fu")}`}</div>
                <div className="col col-3">
                  +{record.deltas[wins[0].winner]}
                </div>
              </div>
            );
          } else {
            content = (
              <>
                {wins.map((win) => (
                  <div className="row" key={win.winner}>
                    <div className="col col-3 win-prompt">
                      {t("jargon.ron")}
                    </div>
                    <div className="col col-3">{players[win.winner].name}</div>
                    <div className="col col-3">{`${win.fan}${t("jargon.fan")} ${
                      win.fu
                    }${t("jargon.fu")}`}</div>
                    <div className="col col-3">
                      +{record.deltas[win.winner]}
                    </div>
                  </div>
                ))}

                <div className="row">
                  <div className="col col-3 deal-in-prompt">
                    {t("jargon.dealIn")}
                  </div>
                  <div className="col col-3">
                    {players[wins[0].dealIn].name}
                  </div>
                  <div className="col col-3 offset-3">
                    {record.deltas[wins[0].dealIn]}
                  </div>
                </div>
              </>
            );
          }
        } else {
          const info = record.info as DrawRecord;
          const tenpaied = players.filter((_player, idx) => info[idx]);
          const displayTenpai =
            tenpaied.length < players.length && tenpaied.length > 0;
          content = (
            <div className="row">
              <div className="col col-3 draw-prompt">Exhaustive draw</div>
              <div className="col col-9">
                {displayTenpai &&
                  players.map((player, idx) => (
                    <div className="row" key={player.seating}>
                      <div className="col col-8">{player.name}</div>
                      {/* TODO: format negative numbers */}
                      <div className="col col-4">
                        {record.deltas[idx] > 0 ? "+" : ""}
                        {record.deltas[idx]}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        }
        const key = `${record.round}.${record.wind}.${record.honba}`;
        return (
          <div className="card" key={key}>
            <div className="card-body">
              <h5 className="card-header">
                {t("jargon.kyokuTemp", {
                  wind: getWind(record.wind),
                  round: record.round,
                  honba: record.honba,
                })}
              </h5>
              <div className="container round-entry">{content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
