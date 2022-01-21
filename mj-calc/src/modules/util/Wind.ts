export type WindNumber = 0 | 1 | 2 | 3;

/**Number of Players */
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
      return "East";
    case 1:
      return "South";
    case 2:
      return "West";
    case 3:
      return "North";
    default:
      const _exhaustiveCheck: never = windNum;
      return _exhaustiveCheck;
  }
}
