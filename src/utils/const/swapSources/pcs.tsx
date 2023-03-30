import type { AssetProps } from "../assets";
import type { SwapSourceProps } from "./swapSources";

export const pcsSourceQuote = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  const result: [string, string, string] = ["", "", ""];
  // const queryUrl =
  //   "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
  //   selectedAsset1Addr +
  //   "&toTokenAddress=" +
  //   selectedAsset2Addr +
  //   "&amount=" +
  //   weiInput +
  //   "&gasPrice=" +
  //   gasDefault;
  // fetch(queryUrl)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.error) {
  //       result = ["0", data.error];
  //     } else {
  //       result = [data.toTokenAmount, ""];
  //     }
  //   });
  return result;
};

// TODO: pcsSourceSwap()

export const pancakeswapSource: SwapSourceProps = {
  id: "PCS",
  name: "PancakeSwap",
  type: "Automated Market Maker",
  imagesq: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
  imagelg: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
  integrated: false,
  outputWei: "0",
  gasEstGwei: "",
  loading: false,
  error: "",
};