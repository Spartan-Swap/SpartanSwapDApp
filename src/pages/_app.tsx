import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { WagmiConfig } from "wagmi";
import { wagmiClient } from "../components/wallet/client";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { store } from "../state/store";
import { Provider as ReduxProvider } from "react-redux";

import { Provider as JotaiProvider } from "jotai";

const globalFormat = {
  prefix: "",
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: " ",
  fractionGroupSize: 0,
  suffix: "",
};

BigNumber.config({ FORMAT: globalFormat });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [clientSideRender, setClientSideRender] = useState(false);

  useEffect(() => {
    setClientSideRender(true);
  }, []);

  if (!clientSideRender) {
    return <div>Loading...</div>;
  } else {
    return (
      <ReduxProvider store={store}>
        <JotaiProvider>
          <WagmiConfig client={wagmiClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WagmiConfig>
        </JotaiProvider>
      </ReduxProvider>
    );
  }
}
