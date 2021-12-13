export type pointType = 0 | 1;
export interface IPoint {
    type: pointType,
    score: number,
}
export type IPointTable = [IPoint , IPoint];
export default function PointTable({
    pointTable,
    pointCell,
} : {
    pointTable: IPointTable,
    pointCell: (point:IPoint) =>  JSX.Element, 
}) {
    return <>
        <div className="point-table container">
            <div className="row">
                <div className="col-4">
                    {/* Fan */}
                    {pointCell(pointTable[0])}
                </div>
                <div className="col-4 center-line">
                    {/* Fu */}
                    {pointCell(pointTable[1])}
                </div>
            </div>
        </div>
    </>;
}