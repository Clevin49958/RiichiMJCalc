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
    { label: "0", uma: [0, 0, 0, 0] },
    { label: "15, 5", uma: [15, 5, -5, -15] },
    { label: "20, 10", uma: [20, 10, -10, -20] },
    { label: "30, 10", uma: [30, 10, -10, -30] },
  ],
  3: [
    { label: "0", uma: [0, 0, 0] },
    { label: "15, 0", uma: [15, 0, -15] },
    { label: "20, 0", uma: [20, 0, -20] },
    { label: "30, 0", uma: [30, 0, -30] },
  ],
  2: [
    { label: "0", uma: [0, 0] },
    { label: "+- 15", uma: [15, -15] },
  ],
};

export default function FinalPoints() {
  const { players, gameStatus } = useContext(GameContext);
  const umaPresets = AllUmaPresets[gameStatus.numPlayers];
  const [umaOption, setUmaOption] = useState(umaPresets[0]);
  const sortedPlayers = [...players].sort(
    (playerA, playerB) => playerA.score - playerB.score,
  );
  //
  // const STARTING_POINT = [25000, 35000, 50000];
  //   const finalPoints = sortedPlayers.map((player, idx) => {
  //     return (player.score -
  //   })
  return (
    <div className="card">
      <div className="card-title">Final points: </div>
      <div className="card-body">
        <div className="d-flex flex-wrap flex-row">
          <Select<Uma>
            options={umaPresets}
            defaultValue={umaOption}
            onChange={(uma) => setUmaOption(uma!)}
          />
          <table className="table">
            <thead>
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
                  <th scope="col" key={player.seating}>
                    {player.score}
                  </th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
