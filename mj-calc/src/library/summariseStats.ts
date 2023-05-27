import { Player } from "@prisma/client";
import assert from "assert";
import { concat, omit, sum, sumBy } from "lodash";
import { FullGame } from "../modules/types/Game";
import { DEFAULT_N_PLAYERS } from "../modules/types/Player";
import { bloatGameStatus, deepParseGameEntity } from "../modules/util/Simplify";
import { GameSetting } from "../modules/types/GameSetting";
import { getDeltaOneWinner } from "../modules/util/Score";

export interface SummariseStatsProps {
  games: FullGame[];
  player: string;
}

export function getPlacing(playerScores: Player[], index: number): number {
  // 0-indexed starting placing
  const { score } = playerScores[index];

  const placing = playerScores.reduce(
    (prev, curr) =>
      prev +
      (curr.score > score ||
      (curr.score === score && curr.seating < playerScores[index].seating)
        ? 1
        : 0),
    0
  );
  return placing;
}

export function summariseStats({ games, player }: SummariseStatsProps) {
  const placingDistributions: number[] = Array(
    games?.[0].players.length ?? DEFAULT_N_PLAYERS
  ).fill(0);

  let totalGames = 0;
  let totalHonba = 0;
  let dealIn = 0;
  let win = 0;
  let tsumo = 0;
  let exhaustiveDraw = 0;
  let tenpaiWhenExhaust = 0;
  let riichi = 0;
  let winValue = 0;
  let dealInValue = 0;
  let busted = 0;

  for (let index = 0; index < games.length; index++) {
    const game = games[index];

    const pidx = game.players.findIndex(
      (playerScore) => playerScore.name === player
    );
    if (pidx === -1) {
      // eslint-disable-next-line no-continue
      continue;
    }
    totalGames++;
    const { seating } = game.players[pidx];

    // placing
    const placing = getPlacing(game.players, pidx);
    placingDistributions[placing]++;

    if (game.players[pidx].score < 0) {
      busted++;
    }

    const gameEntity = bloatGameStatus({
      ...game,
      settings: game.gameSetting! as GameSetting,
    } as ReturnType<typeof deepParseGameEntity>);

    for (let honbaIdx = 0; honbaIdx < gameEntity.records.length; honbaIdx++) {
      const record = gameEntity.records[honbaIdx];
      totalHonba++;
      if (record.richii[seating]) {
        riichi++;
      }

      if (record.type === "Draw") {
        exhaustiveDraw++;
        if (record.info[seating]) {
          tenpaiWhenExhaust++;
        }
      } else {
        assert(
          record.info.length > 0,
          "There should be at least one winner record"
        );
        if (
          record.info[0].dealIn === seating &&
          record.info[0].winner !== seating
        ) {
          // deal in
          dealIn++;
          dealInValue -= record.deltas[seating];
        } else {
          // win
          for (let recordIdx = 0; recordIdx < record.info.length; recordIdx++) {
            const winInfo = record.info[recordIdx];
            if (winInfo.winner === seating) {
              win++;
              if (winInfo.dealIn === seating) {
                tsumo++;
              }
              winValue += getDeltaOneWinner(
                winInfo,
                record,
                gameEntity.settings
              )[seating];
            }
          }
        }
      }
    }
  }

  return {
    totalGames,
    placingDistributions,
    totalHonba,
    dealIn,
    win,
    tsumo,
    exhaustiveDraw,
    tenpaiWhenExhaust,
    riichi,
    winValue,
    dealInValue,
    busted,
    player: [player],
  };
}

export function mergeStats(stats: PlayerStats[]): PlayerStats {
  const res = Object.fromEntries(
    Object.keys(omit(stats[0], "placingDistribution", "player")).map((key) => [
      key,
      sumBy(stats, key),
    ])
  ) as unknown as Omit<PlayerStats, "placingDistribution" | "player">;
  const placingDistributions = stats[0].placingDistributions.map(
    (_value, idx) => sum(stats.map((stat) => stat.placingDistributions[idx]))
  );
  const player = concat(...stats.map((stat) => stat.player));

  return {
    ...res,
    placingDistributions,
    player,
  };
}

export function fractionaliseStats({
  totalGames,
  placingDistributions,
  totalHonba,
  dealIn,
  win,
  tsumo,
  exhaustiveDraw,
  tenpaiWhenExhaust,
  riichi,
  winValue,
  dealInValue,
  busted,
  player,
}: PlayerStats): PlayerStats {
  return {
    totalGames,
    placingDistributions: placingDistributions.map(
      (freq) => (freq / totalGames) * 100
    ),
    totalHonba,
    dealIn: (dealIn / totalHonba) * 100,
    win: (win / totalHonba) * 100,
    tsumo: (tsumo / win) * 100,
    exhaustiveDraw: (exhaustiveDraw / totalHonba) * 100,
    tenpaiWhenExhaust: (tenpaiWhenExhaust / exhaustiveDraw) * 100,
    riichi: (riichi / totalHonba) * 100,
    winValue: winValue / win,
    dealInValue: dealInValue / dealIn,
    busted: (busted / totalGames) * 100,
    player,
  };
}

export type PlayerStats = ReturnType<typeof summariseStats>;
