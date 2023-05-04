import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const games = await getAllGames({
    orderBy: {
      endTime: "desc",
    },
  });
  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common"])),
      games,
    },
    revalidate: 10,
  };
};
