import { IPlayerTable } from "../util/IPlayer";
import { DrawRecord, IRecord, WinRecord } from "../util/IRecord";
import { getWind } from "../util/Wind";

export default function RoundHistory({
  records,
  players,
}: {
  records: IRecord[];
  players: IPlayerTable;
}) {
  return (
    <div className="card-column my-2">
      {[...records].reverse().map((record) => {
        let content: JSX.Element;
        if (record.type === "Win") {
          const wins = record.info;
          if (wins[0].winner === wins[0].dealIn) {
            content = (
              <div className="row">
                <div className="col col-3 win-prompt">Tsumo</div>
                <div className="col col-3">{players[wins[0].winner].name}</div>
                <div className="col col-3">{`${wins[0].fan}Fan ${wins[0].fu}Fu`}</div>
                <div className="col col-3">
                  +{record.deltas[wins[0].winner]}
                </div>
              </div>
            );
          } else {
            content = (
              <>
                {wins.map((win) => (
                  <div className="row">
                    <div className="col col-3 win-prompt">Ron</div>
                    <div className="col col-3">{players[win.winner].name}</div>
                    <div className="col col-3">{`${win.fan}Fan ${win.fu}Fu`}</div>
                    <div className="col col-3">
                      +{record.deltas[win.winner]}
                    </div>
                  </div>
                ))}

                <div className="row">
                  <div className="col col-3 deal-in-prompt">Deal in</div>
                  <div className="col col-3">
                    {players[wins[0].dealIn].name}
                  </div>
                  <div className="col col-3 offset-3">
                    {record.deltas[wins[0].dealIn]}
                  </div>
                </div>
              </>
            );
          }
        } else {
          const info = record.info as DrawRecord;
          const tenpaied = players.filter((_player, idx) => info.tenpai[idx]);
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
  );
}
