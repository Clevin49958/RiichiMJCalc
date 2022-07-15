import { Line } from "react-chartjs-2";
import { PlayerList } from "../types/Player";
import { GameRecord } from "../types/Record";
import {
  Chart as ChartJS,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { GameStatus } from "../types/GameStatus";
import { getWind } from "../util/Wind";
import { STARTING_POINT } from "../util/Constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const COLOR_CODES = [
  [255, 99, 132],
  [75, 192, 192],
  [255, 205, 86],
  [153, 102, 255],
];

function getPointsLabel({ wind, round, honba }: GameStatus | GameRecord) {
  if (round === 1 && honba === 0) {
    return `${getWind(wind)}`;
  }
  if (honba === 0) {
    return `${getWind(wind)}${round}`;
  }
  return `${getWind(wind)}${round}-${honba}`;
}

export function PointsPlot({
  players,
  gameRecord,
  gameStatus,
}: {
  players: PlayerList;
  gameRecord: GameRecord[];
  gameStatus: GameStatus;
}) {
  const n = players.length;
  const startingPoint = STARTING_POINT[4 - n];

  const colors = COLOR_CODES.map((codes) => `rgb(${codes.join(",")})`);
  const bgColors = COLOR_CODES.map((codes) => `rgba(${codes.join(",")}, 0.5)`);

  const ptsData: number[][] = Array(n)
    .fill(0)
    .map(() => Array(1).fill(startingPoint));

  gameRecord.forEach((record, iRecord) => {
    record.deltas.forEach((delta, iDelta) => {
      ptsData[iDelta].push(ptsData[iDelta][iRecord] + delta);
    });
  });

  // players' points
  const datasets = ptsData.map((ptsData, index) => ({
    label: players[index].name,
    data: ptsData,
    borderColor: colors[index],
    backgroundColor: bgColors[index],
  }));

  // labels (x)
  const labels = [""];
  labels.push(...gameRecord.map(getPointsLabel));
  const data: Parameters<typeof Line>[0]["data"] = {
    labels,
    datasets,
  };

  // Wind region (starting index)
  const regions = gameRecord
    .map((record, index, array) =>
      index === 0 || record.wind !== array[index - 1].wind ? index + 1 : -1
    )
    .filter((idx) => idx !== -1);
  const annotations = Object.fromEntries(
    regions.map((region, index) => [
      index,
      {
        drawTime: "afterDatasetsDraw",
        type: "line",
        xMin: region,
        xMax: region,
        borderColor: "rgba(255, 99, 132, 0.6)",
        borderWidth: 2,
      },
    ])
  );

  // options
  const options: Parameters<typeof Line>[0]["options"] = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      y: {
        ticks: {
          stepSize: 2500,
        },
        grid: {
          color: function (context: any) {
            if (context.tick.value > 25000) {
              // green
              return "rgba(75, 192, 192, 0.5)";
            } else if (context.tick.value === 25000) {
              return "#000000";
            } else if (context.tick.value >= 0) {
              // orange
              return "rgba(255, 159, 64, 0.5)";
            }
            // red
            return "rgba(255, 99, 132, 0.5)";
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        font: {
          family: "Helvetica",
          size: 14,
          weight: "bold",
        },
        display: true,
        text: "Final points",
      },
      annotation: {
        annotations: annotations as any,
      },
    },
  };

  return (
    <div className="card mt-2">
      <div className="card-body">
        <Line options={options} data={data}></Line>
      </div>
    </div>
  );
}
