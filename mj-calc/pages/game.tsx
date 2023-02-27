import React from "react";
import { InferGetStaticPropsType } from "next";
import GameList from "../src/modules/components/GameList";
import { findAllPosts } from "../src/library/getAllPosts";

export default function GameListPage({
  games,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <GameList games={games} />;
}

export async function getStaticProps() {
  const games = await findAllPosts();
  return {
    props: {
      games,
    },
  };
}
