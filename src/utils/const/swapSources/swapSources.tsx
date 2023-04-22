import { zeroExAllowance, zeroExQuote, zeroExSource } from "./zeroEx";
import { spv2Allowance, spv2Quote, spv2Source } from "./spv2";
import { pcsSource, pcsQuote } from "./pcs";
import { oneInchAllowance, oneInchQuote, oneInchSource } from "./oneInch";
import { address0 } from "../addresses";
import { veryBigWeiNumber } from "../general";

import type { Provider } from "@wagmi/core";
import type { AssetProps } from "../assets";
import { asyncWrapper } from "../../helpers/promises";

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
  allowanceTarget: string;
  allowance: string;
};

export const swapSources: SwapSourceProps[] = [
  spv2Source,
  oneInchSource,
  zeroExSource,
  pcsSource,
];

export const getSwapSourceQuote = (
  sourceId: string,
  args: [
    selectedAsset1: AssetProps,
    selectedAsset2: AssetProps,
    weiInput: string,
    provider: Provider
  ]
) => {
  switch (sourceId) {
    case "SPV2":
      return spv2Quote(args[0], args[1], args[2], args[3]);
    case "1INCH":
      return oneInchQuote(args[0], args[1], args[2]);
    case "0X":
      return zeroExQuote(args[0], args[1], args[2]);
    case "PCS":
      return pcsQuote(args[0], args[1], args[2]);
    default:
      console.log("incorrect swap-source ID for external call");
  }
};

export const getSwapSourceAllowance = (
  sourceId: string,
  args: [selectedAsset1: AssetProps, provider: Provider, userWalletAddr: string, allowanceTarget?: string]
) => {
  // TODO: This should be called at the same time as the quotes (if wallet/etc available) & inserted ...
  // ... inside the source object (so we can show the user which sources they already have approvals for)
  if (args[0].address.toLowerCase() === address0) {
    // could otherwise look for (args[0].type === "Native Coin")
    return asyncWrapper(veryBigWeiNumber); // If native gas asset, we dont need approval
  } else {
    switch (sourceId) {
      case "SPV2":
        return spv2Allowance(args[0], args[1], args[2],);
      case "1INCH":
        return oneInchAllowance(args[0], args[2]);
      case "0X":
        return zeroExAllowance(args[0], args[1], args[2], args[3] ?? "");
      case "PCS":
        return asyncWrapper("0"); // TODO
      default:
        console.log("incorrect swap-source ID for external call");
        return asyncWrapper("0");
    }
  }
};

export const getSwapSourceApproveCalldata = () => {
  // TODO
};

export const getSwapSourceTxnCalldata = () => {
  // TODO
};
