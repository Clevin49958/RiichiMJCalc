import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Startup from "../src/modules/Startup";
import { getAllPlayerNames } from "../src/library/getAllPlayers";

function App({ playerPool }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Startup playerPool={playerPool} />;
}

export default App;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const [translation, playerPool] = await Promise.all([
    serverSideTranslations(locale!, ["common"]),
    getAllPlayerNames(),
  ]);
  return {
    props: {
      ...translation,
      playerPool,
    },
    revalidate: 10,
  };
};
