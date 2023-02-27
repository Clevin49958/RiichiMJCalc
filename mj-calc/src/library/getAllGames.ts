import { merge } from "lodash";
import { prisma } from "../../prisma/client";

export async function getAllGames(
  query: Parameters<typeof prisma.game.findMany>[0] = {}
) {
  const findGamesInput = merge(query, {
    include: {
      gameSetting: true,
      players: true,
    },
  });

  const games = await prisma.game.findMany(findGamesInput);
  return games;
}
