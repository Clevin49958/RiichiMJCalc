import GameContext from "../context/GameContext";
import { useContext, useState } from "react";
import Select from "react-select/";
import { STARTING_POINT } from "../util/Constants";
import GameSettingContext from "../context/GameSettingContext";

interface Uma {
  label: string;
  uma: number[];
}

interface Oka {
  label: string;
  oka: number[];
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

const AllOkaPresets = {
  4: [
    { label: "0", oka: [0, 0, 0, 0] },
    { label: "20", oka: [15, -5, -5, -5] },
  ],
  3: [{ label: "0", oka: [0, 0, 0] }],
  2: [{ label: "0", oka: [0, 0] }],
};

export default function FinalPoints() {
  const { players } = useContext(GameContext);
  const { numPlayers } = useContext(GameSettingContext);
  const startingPoint = STARTING_POINT[4 - numPlayers];
  const umaPresets = AllUmaPresets[numPlayers];
  const okaPresets = AllOkaPresets[numPlayers];
  const [umaOption, setUmaOption] = useState(umaPresets[0]);
  const [okaOption, setOkaOption] = useState(okaPresets[0]);

  const sortedPlayers = [...players].sort(
    (playerA, playerB) => playerB.score - playerA.score
  );
  const rawPoints = sortedPlayers.map((player) => {
    return (player.score - startingPoint) / 1000;
  });
  const finalPoints = rawPoints.map((pt, idx) => {
    return pt + umaOption.uma[idx] + okaOption.oka[idx];
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
            {okaPresets.length > 1 && (
              <div className="my-2 col col-6 col-lg-2">
                <label>
                  <div className="mb-1">Oka preset:</div>
                  <Select<Oka>
                    options={okaPresets}
                    defaultValue={okaOption}
                    onChange={(oka) => setOkaOption(oka!)}
                  />
                </label>
              </div>
            )}
            <div
              className={`col col-12 col-lg-${okaPresets.length > 1 ? 8 : 10}`}
            >
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
                    <th scope="row">Ending Score</th>
                    {sortedPlayers.map((player) => (
                      <th key={player.seating}>{player.score}</th>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">{"\u0394"}Score</th>
                    {rawPoints.map((pt, idx) => (
                      <th key={sortedPlayers[idx].seating}>{pt * 1000}</th>
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
