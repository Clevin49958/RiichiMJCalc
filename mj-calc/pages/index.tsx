import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Startup from "../src/modules/Startup";

function App(_obj: InferGetStaticPropsType<typeof getStaticProps>) {
  return <Startup />;
}

export default App;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common"])),
  },
  revalidate: 10,
});
