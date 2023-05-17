import React from "react";
import { useTranslation } from "next-i18next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import chartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";
import { PlayerStats } from "../../../library/summariseStats";

ChartJS.register(ArcElement, Tooltip, Legend, chartDataLabels);
export default function PlacingPieChart({
  placing,
}: {
  placing: PlayerStats["placingDistributions"];
}) {
  const { t } = useTranslation("common");

  return (
    <div className="container-fluid">
      <h4 className="text-center">{t("stats.rankDistribution")}</h4>
      <Pie
        data={{
          labels: ["1", "2", "3", "4"],
          datasets: [
            {
              data: placing,
              backgroundColor: [
                "rgb( 40, 167,  69)",
                "rgb( 23, 162, 184)",
                "rgb(108, 117, 125)",
                "rgb(220,  53,  69)",
              ],
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              color: "#FFFFFF",
              font: {
                size: 14,
                weight: "bold",
              },
              formatter: (value: number, context) =>
                `${t("util.ranking", {
                  count: context.dataIndex + 1,
                  ordinal: true,
                })}\n${value.toFixed(2)}%`,
              // align: "end",
              offset: -1,
            },
          },
        }}
      />
    </div>
  );
}
