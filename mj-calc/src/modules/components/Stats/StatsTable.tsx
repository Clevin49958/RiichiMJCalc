import React from "react";
import { omit } from "lodash";
import { useTranslation } from "next-i18next";
import { PlayerStats } from "../../../library/summariseStats";

export default function StatsTable({ stats }: { stats: PlayerStats }) {
  const { t } = useTranslation("common");
  const noFormat = (num: number) => num.toString();
  const percentage = (num: number) => `${num.toFixed(2)}%`;
  const wholeNumber = (num: number) => `${num.toFixed(0)}`;

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
    ["winValue", wholeNumber],
    ["dealInValue", wholeNumber],
    ["busted", percentage],
  ] as [keyof typeof itemStats, (num: number) => string][];

  return (
    <div className="container-fluid">
      <h2 className="text-center">{stats.player.join(", ")}</h2>
      <div className="row">
        {content.map(([key, formatter]) => (
          <div key={key} className="col-12 col-md-6 col-xl-4">
            {t(`stats.${key}`)}: {formatter(itemStats[key])}
          </div>
        ))}
      </div>
    </div>
  );
}
