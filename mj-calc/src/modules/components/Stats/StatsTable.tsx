import React from "react";
import { omit } from "lodash";
import { useTranslation } from "react-i18next";
import { PlayerStats } from "../../../library/summariseStats";

export default function StatsTable({ stats }: { stats: PlayerStats }) {
  const { t } = useTranslation("common");
  const noFormat = (num: number) => num.toString();
  const percentage = (num: number) => `${num.toFixed(2)}%`;

  const itemStats = omit(stats, "placingDistributions", "player");

  const content = [
    ["totalGames", noFormat],
    ["totalHonba", noFormat],
    ["win", percentage],
    ["dealIn", percentage],
    ["tsumo", percentage],
    ["exhaustiveDraw", percentage],
    ["tenpaiWhenExhaust", percentage],
    ["riichi", percentage],
    ["winValue", noFormat],
    ["dealInValue", noFormat],
    ["busted", percentage],
  ] as [keyof typeof itemStats, (num: number) => string][];

  return (
    <div className="container">
      <h2 className="text-center mt-4">{stats.player.join(", ")}</h2>
      <div className="row">
        {content.map(([key, formatter]) => (
          <div key={key} className="col-12 col-md-6 col-xl-4">
            {t(key)}: {formatter(itemStats[key])}
          </div>
        ))}
      </div>
    </div>
  );
}
