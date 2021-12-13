export type WindNumber = 0 | 1 | 2 | 3;

export type Wind = "East" | "South" | "West" | "North"

export function getWind(windNum: WindNumber) {
    /**
     * 0: East,
     * 1: South,
     * 2: West,
     * 3: North
     */
    switch (windNum){
        case 0:
            return "East";
        case 1:
            return "South";
        case 2:
            return "West";
        case 3:
            return "North";

    }

}