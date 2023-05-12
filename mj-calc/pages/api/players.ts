import { NextApiRequest, NextApiResponse } from "next";

import { getAllPlayerNames } from "../../src/library/getAllPlayers";

const getHander = async (req: NextApiRequest, res: NextApiResponse) => {
  const players = (await getAllPlayerNames()).sort();

  res.status(200).json(players);
};

export default async function playersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await getHander(req, res);
      break;

    default:
      break;
  }
}
