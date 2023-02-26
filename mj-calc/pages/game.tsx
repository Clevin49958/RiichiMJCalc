import React, { useEffect, useState } from "react";
import GameList from "../src/modules/components/gameList";

export default function GameListPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/game", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setGames(res));
  }, []);
  return <GameList games={games} />;
}
