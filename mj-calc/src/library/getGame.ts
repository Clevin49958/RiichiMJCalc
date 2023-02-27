import { merge } from "lodash";
import { prisma } from "../../prisma/client";

export async function getGame(
  query: Parameters<typeof prisma.game.findUnique>[0]
) {
  const findGameInput = merge(query, {
    include: {
      gameSetting: true,
      players: true,
      records: true,
    },
  });

  const games = await prisma.game.findUnique(findGameInput);
  return games;
}
