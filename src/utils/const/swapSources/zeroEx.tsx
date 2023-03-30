import { address0, affiliateAddr } from "../addresses";
import { gasDefault } from "../general";

import type { AssetProps } from "../assets";
import type { SwapSourceProps } from "./swapSources";

export const zeroExQuote = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  // TODO: Handle gas asset (coin) string based on network selected
  // ie. if ethereum mainnet and address === address(0) use "ETH" instead of "BNB"
  const _asset1Addr =
    selectedAsset1.address.toLowerCase() === address0
      ? "BNB"
      : selectedAsset1.address;
  const _asset2Addr =
    selectedAsset2.address.toLowerCase() === address0
      ? "BNB"
      : selectedAsset2.address;
  let returnVal: [string, string, string] = ["", "", ""];
  const queryUrl =
    "https://bsc.api.0x.org/swap/v1/quote?sellToken=" +
    _asset1Addr +
    "&buyToken=" +
    _asset2Addr +
    "&sellAmount=" +
    weiInput +
    "&gasPrice=" +
    gasDefault +
    "&affiliateAddress=" +
    affiliateAddr; // Just for DAU tracking, not actual affiliate fees
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.reason) {
        returnVal = ["0", "", data.reason];
      } else {
        returnVal = [data.buyAmount, data.estimatedGas, ""];
      }
    });
  return returnVal;
};

export const zeroExSwap = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  userWalletAddr: string
) => {
  // TODO: Handle gas asset (coin) string based on network selected
  // ie. if ethereum mainnet and address === address(0) use "ETH" instead of "BNB"
  const _asset1Addr =
    selectedAsset1.address.toLowerCase() === address0
      ? "BNB"
      : selectedAsset1.address;
  const _asset2Addr =
    selectedAsset2.address.toLowerCase() === address0
      ? "BNB"
      : selectedAsset2.address;
  let returnVal: [string, string, string] = ["", "", ""];
  const takerString = userWalletAddr ? "&takerAddress=" + userWalletAddr : "";
  const queryUrl =
    "https://bsc.api.0x.org/swap/v1/quote?sellToken=" +
    _asset1Addr +
    "&buyToken=" +
    _asset2Addr +
    "&sellAmount=" +
    weiInput +
    "&gasPrice=" +
    gasDefault +
    "&affiliateAddress=" +
    affiliateAddr + // Just for DAU tracking, not actual affiliate fees
    takerString;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.reason) {
        returnVal = ["0", "", data.reason];
      } else {
        returnVal = [data.buyAmount, data.estimatedGas, ""];
      }
    });
  return returnVal;
};

export const zeroExSource: SwapSourceProps = {
  id: "0X",
  name: "0x",
  type: "Swap Aggregator",
  imagesq: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  imagelg: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  integrated: false,
  outputAmount: "0",
  gasEstimate: "",
  loading: false,
  error: "",
};
