import { IPlayerTable } from "./util/IPlayer";
import { DrawRecord, IRecord, WinRecord } from "./util/IRecord";
import { getWind } from "./util/Wind";

export default function RoundHistory({
  records,
  players,
} : {
  records: IRecord[], 
  players: IPlayerTable,
}) {
  return <div className="card-column">
    {[...records].reverse().map(record => {
      let content: JSX.Element;
      if (record.type === "Win") {
        const info = record.info as WinRecord;
        if (info.winner === info.dealIn) {
          content = <div className="row">
            <div className="col col-3 win-prompt">
              Tsumo
            </div>
            <div className="col col-6">
              {players[info.winner].name}
            </div>
            <div className="col col-3">
              +{record.deltas[info.winner]}
            </div>
          </div>
        } else {
          content = <>
            <div className="row">
              <div className="col col-3 win-prompt">
                Ron
              </div>
              <div className="col col-6">
                {players[info.winner].name}
              </div>
              <div className="col col-3">
                +{record.deltas[info.winner]}
              </div>
            </div>
            <div className="row">
              <div className="col col-3 deal-in-prompt">
                Deal in
              </div>
              <div className="col col-6">
                {players[info.dealIn].name}
              </div>
              <div className="col col-3">
                {record.deltas[info.dealIn]}
              </div>
            </div>
          </>
        }
      } else {
        const info = record.info as DrawRecord;
        content = <div className="row">
          <div className="col col-3 draw-prompt">
            Exhaustive draw
          </div>
          <div className="col col-9">
            {[0, 1, 2, 3]
              .filter(idx => info.tenpai[idx])
              .map(idx => 
                <div className="row" key={idx}>
                  <div className="col col-8">
                    {players[idx].name}
                  </div>
                  <div className="col col-4">
                    +{record.deltas[idx]}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      }
      return <div className="card">
        <div className="card-body">
          <h5 className="card-header">
            {getWind(record.wind)} {record.round} &nbsp;&nbsp;{record.honba} honba (Repeat Counter)
          </h5>
          <div className="container round-entry">
            {content}
          </div>
        </div>
      </div>
    })}
  </div>
}
