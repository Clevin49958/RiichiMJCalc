import { AppProps } from "next/app";
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Analytics } from "@vercel/analytics/react";
import "./_app.css";
import "./_index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { appWithTranslation } from "next-i18next";
import { SSRProvider } from "react-bootstrap";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Component {...pageProps} />
      {/* <Script
        src="https://kit.fontawesome.com/90005fdbae.js"
        crossOrigin="anonymous"
      /> */}
      <Analytics />
    </SSRProvider>
  );
}

export default appWithTranslation(MyApp);
