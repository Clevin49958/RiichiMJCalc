import { prisma } from "../../prisma/client";

export async function getAllPlayerNames() {
  const players = await prisma.player.findMany({
    distinct: ["name"],
    select: {
      name: true,
    },
  });
  return players.map((player) => player.name);
}
