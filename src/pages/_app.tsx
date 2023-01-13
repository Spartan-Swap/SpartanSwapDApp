import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { WagmiConfig } from "wagmi";
import { wagmiClient } from "../components/wallet/client";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

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
      <WagmiConfig client={wagmiClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    );
  }
}
