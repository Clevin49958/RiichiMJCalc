import { IPlayerTable } from "./util/IPlayer";
import { DrawRecord, IRecord, WinRecord } from "./util/IRecord";
import { getWind } from "./util/Wind";

export default function RoundHistory({
  records,
  players,
}: {
  records: IRecord[];
  players: IPlayerTable;
}) {
  return (
    <div className="row">
      <div className="col col-12">
        <div className="card-column">
          {[...records].reverse().map((record) => {
            let content: JSX.Element;
            if (record.type === "Win") {
              const info = record.info as WinRecord;
              if (info.winner === info.dealIn) {
                content = (
                  <div className="row">
                    <div className="col col-3 win-prompt">Tsumo</div>
                    <div className="col col-6">{players[info.winner].name}</div>
                    <div className="col col-3">
                      +{record.deltas[info.winner]}
                    </div>
                  </div>
                );
              } else {
                content = (
                  <>
                    <div className="row">
                      <div className="col col-3 win-prompt">Ron</div>
                      <div className="col col-6">
                        {players[info.winner].name}
                      </div>
                      <div className="col col-3">
                        +{record.deltas[info.winner]}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col col-3 deal-in-prompt">Deal in</div>
                      <div className="col col-6">
                        {players[info.dealIn].name}
                      </div>
                      <div className="col col-3">
                        {record.deltas[info.dealIn]}
                      </div>
                    </div>
                  </>
                );
              }
            } else {
              const info = record.info as DrawRecord;
              const tenpaied = players.filter(
                (_player, idx) => info.tenpai[idx],
              );
              const displayTenpai =
                tenpaied.length < players.length && tenpaied.length > 0;
              content = (
                <div className="row">
                  <div className="col col-3 draw-prompt">Exhaustive draw</div>
                  <div className="col col-9">
                    {displayTenpai &&
                      players.map((player, idx) => (
                        <div className="row" key={idx}>
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
                    {getWind(record.wind)} {record.round} &nbsp;&nbsp;
                    {record.honba} honba (Repeat Counter)
                  </h5>
                  <div className="container round-entry">{content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
