import { Line } from "react-chartjs-2";
import { IPlayerTable } from "./util/IPlayer";
import { IRecord } from "./util/IRecord";
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
import { GameStatus } from "./util/GameStatus";
import { getWind } from "./util/Wind";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

const COLOR_CODES = [
  [255, 99, 132],
  [75, 192, 192],
  [255, 205, 86],
  [153, 102, 255],
];

export function PointsPlot({
  players,
  gameRecord,
  startingPoint,
  gameStatus,
}: {
  players: IPlayerTable;
  gameRecord: IRecord[];
  startingPoint: number;
  gameStatus: GameStatus;
}) {
  const n = players.length;

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
  const labels = gameRecord.map(
    (record) => `${getWind(record.wind)}${record.round}.${record.honba}`
  );
  labels.push(
    `${getWind(gameStatus.wind)}${gameStatus.round}.${gameStatus.honba}`
  );
  const data = {
    labels,
    datasets,
  };
  return (
    <div className="card">
      <div className="card-header">Final points: </div>
      <div className="card-body">
        <Line options={options} data={data}></Line>
      </div>
    </div>
  );
}
