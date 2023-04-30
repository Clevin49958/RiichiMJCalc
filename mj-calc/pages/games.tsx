import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import GameList from "../src/modules/components/GameList";
import { getAllGames } from "../src/library/getAllGames";
import MjNavBar from "../src/modules/components/MjNavBar";

export default function GameListPage({
  games,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MjNavBar />
      <GameList games={games} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const games = await getAllGames();
  return {
    props: {
      games,
    },
    revalidate: 10,
  };
};
