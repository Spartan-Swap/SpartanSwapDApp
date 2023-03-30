import { zeroExQuote, zeroExSource } from "./zeroEx";
import { spv2Source, spv2SourceQuote } from "./spv2";
import { pancakeswapSource, pcsSourceQuote } from "./pcs";
import type { Provider } from "@wagmi/core";
import type { AssetProps } from "../assets";
import { oneInchSource, oneInchSourceQuote } from "./oneInch";

export type SwapSourceProps = {
  id: string;
  name: string;
  type: "Swap Aggregator" | "Automated Market Maker";
  imagesq: string;
  imagelg: string;
  integrated: boolean;
  outputWei: string;
  gasEstGwei: string;
  loading: boolean;
  error: string;
};

export const swapSources: SwapSourceProps[] = [
  spv2Source,
  oneInchSource,
  zeroExSource,
  pancakeswapSource,
];

export const getSwapSourceQuote = (
  sourceId: string,
  args: [
    selectedAsset1: AssetProps,
    selectedAsset2: AssetProps,
    weiInput: string,
    provider?: Provider | null,
    userWalletAddr?: string | null
  ]
) => {
  switch (sourceId) {
    case "SPV2":
      return spv2SourceQuote(args[0], args[1], args[2], args[3] ?? undefined);
    case "1INCH":
      return oneInchSourceQuote(args[0], args[1], args[2]);
    case "0X":
      return zeroExQuote(args[0], args[1], args[2]);
    case "PCS":
      return pcsSourceQuote(args[0], args[1], args[2]);
    default:
      console.log("incorrect swap-source ID for external call");
  }
};

export const getSwapSourceAllowance = (sourceId: string) => {
  switch (sourceId) {
    case "SPV2":
      return; // TODO
    case "1INCH":
      return; // TODO
    case "0X":
      return; // TODO
    case "PCS":
      return; // TODO
    default:
      console.log("incorrect swap-source ID for external call"); // TODO
  }
};

export const getSwapSourceApproveCalldata = () => {
  // TODO
};

export const getSwapSourceTxnCalldata = () => {
  // TODO
};
