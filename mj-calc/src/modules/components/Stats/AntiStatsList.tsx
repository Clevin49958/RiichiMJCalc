import React from "react";
import { reverse, sortBy } from "lodash";
import { useTranslation } from "next-i18next";
import { AntiStats } from "../../../library/getAntiStatsForPlayer";

export default function AntiStatsTable({
  stats,
  player,
}: {
  stats: AntiStats;
  player: string;
}) {
  const { t } = useTranslation("common");
  const filteredStats = stats.filter((stat) => stat.dealInCount >= 3);

  return (
    <div className="container-fluid mt-4">
      <h3 className="text-center">{t("stats.anti", { name: player })}</h3>
      <div className="row">
        <div className="col-12 col-lg-4">
          <div className="container-fluid">
            <h4 className="text-center">{t("stats.mostPoints")}</h4>
            <ul className="list-group">
              {reverse(sortBy(filteredStats, "dealInValue"))
                // .slice(0, 5)
                .map((stat) => (
                  <li
                    key={stat.player}
                    className="list-group-item"
                  >{`${stat.player}: ${stat.dealInValue}`}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="container-fluid">
            <h4 className="text-center">{t("stats.mostTimes")}</h4>
            <ul className="list-group">
              {reverse(sortBy(filteredStats, "dealInCount"))
                // .slice(0, 5)
                .map((stat) => (
                  <li
                    key={stat.player}
                    className="list-group-item"
                  >{`${stat.player}: ${stat.dealInCount}`}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="container-fluid">
            <h4 className="text-center">{t("stats.mostAverage")}</h4>
            <ul className="list-group">
              {reverse(
                sortBy(
                  filteredStats.map((stat) => ({
                    player: stat.player,
                    avg: stat.dealInValue / stat.dealInCount,
                  })),
                  "avg"
                )
              )
                // .slice(0, 5)
                .map((stat) => (
                  <li key={stat.player} className="list-group-item">{`${
                    stat.player
                  }: ${stat.avg.toFixed(0)}`}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
