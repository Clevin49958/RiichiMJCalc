import GameContext from "./util/Context";
import { useContext, useState } from "react";
import { IPlayerTable } from "./util/IPlayer";
import Select, { SingleValue } from "react-select/";

interface Uma {
  label: string;
  uma: number[];
}
const AllUmaPresets = {
  4: [
    // { label: "0", uma: [0, 0, 0, 0] },
    { label: "15, 5", uma: [15, 5, -5, -15] },
    { label: "20, 10", uma: [20, 10, -10, -20] },
    { label: "30, 10", uma: [30, 10, -10, -30] },
  ],
  3: [
    // { label: "0", uma: [0, 0, 0] },
    { label: "15, 0", uma: [15, 0, -15] },
    { label: "20, 0", uma: [20, 0, -20] },
    { label: "30, 0", uma: [30, 0, -30] },
  ],
  2: [
    // { label: "0", uma: [0, 0] },
    { label: "+- 15", uma: [15, -15] },
  ],
};

export default function FinalPoints({
  startingPoint,
}: {
  startingPoint: number;
}) {
  const { players, gameStatus } = useContext(GameContext);
  const umaPresets = AllUmaPresets[gameStatus.numPlayers];
  const [umaOption, setUmaOption] = useState(umaPresets[0]);
  const sortedPlayers = [...players].sort(
    (playerA, playerB) => playerB.score - playerA.score,
  );
  const finalPoints = sortedPlayers.map((player, idx) => {
    return (player.score - startingPoint) / 1000 + umaOption.uma[idx];
  });
  return (
    <div className="card">
      <div className="card-header">Final points: </div>
      <div className="card-body">
        <div className="container-fluid">
          <div className="row">
            <div className="my-2 col col-6 col-lg-2">
              <label>
                <div className="mb-1">Uma preset:</div>
                <Select<Uma>
                  options={umaPresets}
                  defaultValue={umaOption}
                  onChange={(uma) => setUmaOption(uma!)}
                />
              </label>
            </div>
            <div className="col col-12 col-lg-8">
              <table className="table table-striped table-bordered mx-3">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">#</th>
                    {sortedPlayers.map((player) => (
                      <th scope="col" key={player.seating}>
                        {player.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Pts</th>
                    {sortedPlayers.map((player) => (
                      <th key={player.seating}>
                        {(player.score / 1000).toFixed(1)}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Final pts</th>
                    {finalPoints.map((pts, idx) => (
                      <th key={sortedPlayers[idx].seating}>{pts.toFixed(1)}</th>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
