import { Game, GameSetting, Player, Record } from "@prisma/client";

export type GameSummary = Game & {
  gameSetting: GameSetting | null;
  players: Player[];
};

export type FullGame = GameSummary & {
  records: Record[];
};
