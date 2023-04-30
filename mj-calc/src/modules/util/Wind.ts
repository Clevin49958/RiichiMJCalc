export type WindNumber = 0 | 1 | 2 | 3;

/** Number of Players */
export type NP = 2 | 3 | 4;

export function getWind(windNum: WindNumber) {
  /**
   * 0: East,
   * 1: South,
   * 2: West,
   * 3: North
   */
  switch (windNum) {
    case 0:
      return "東";
    case 1:
      return "南";
    case 2:
      return "西";
    case 3:
      return "北";
    default: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _exhaustiveCheck: never = windNum;
      return _exhaustiveCheck;
    }
  }
}
