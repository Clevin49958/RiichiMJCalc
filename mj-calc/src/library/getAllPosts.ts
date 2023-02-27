import { merge } from "lodash";
import { prisma } from "../../prisma/client";
import { GameFindManySchema } from "../../prisma/generated/schemas/findManyGame.schema";

export async function findAllPosts(
  query: ReturnType<typeof GameFindManySchema.parse> = {}
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
