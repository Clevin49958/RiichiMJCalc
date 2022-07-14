import { Player } from "../types/Player";

export function updatePlayerScore(player: Player, newScore: number) {
  player.lastScore = player.score;
  player.score = newScore;
}
