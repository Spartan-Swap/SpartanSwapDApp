import { address0, oneInchNativeAddr } from "../addresses";
import { gasDefault } from "../general";
import type { AssetProps } from "../assets";
import type { SwapSourceProps } from "./swapSources";

export const oneInchQuote = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  const _asset1Addr =
    selectedAsset1.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : selectedAsset1.address;
  const _asset2Addr =
    selectedAsset2.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : selectedAsset2.address;
  let returnVal: [string, string, string] = ["", "", ""];
  const queryUrl =
    "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
    _asset1Addr +
    "&toTokenAddress=" +
    _asset2Addr +
    "&amount=" +
    weiInput +
    "&gasPrice=" +
    gasDefault;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal = ["0", "", data.error];
      } else {
        returnVal = [data.toTokenAmount, data.estimatedGas.toString(), ""];
      }
    });
  return returnVal;
};

export const oneInchAllowance = async (
  selectedAsset1: AssetProps,
  userWalletAddr: string
) => {
  const _asset1Addr =
    selectedAsset1.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : selectedAsset1.address;
  let returnVal = "";
  const queryUrl =
    "https://api.1inch.io/v5.0/56/approve/allowance?tokenAddress=" +
    _asset1Addr +
    "&walletAddress=" +
    userWalletAddr;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal = "0";
      } else {
        returnVal = data.allowance.toString();
      }
    });
  return returnVal;
};

export const oneInchSwap = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  userWalletAddr: string
) => {
  const _asset1Addr =
    selectedAsset1.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : selectedAsset1.address;
  const _asset2Addr =
    selectedAsset2.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : selectedAsset2.address;
  let returnVal: [
    string,
    string,
    string,
    {
      from: string;
      to: string;
      data: string;
      value: string;
      gasPrice: string;
      gas: string;
    }
  ] = [
    "",
    "",
    "",
    {
      from: "",
      to: "",
      data: "",
      value: "",
      gasPrice: "",
      gas: "",
    },
  ];
  const queryUrl =
    "https://api.1inch.io/v5.0/56/swap?&fromTokenAddress=" +
    _asset1Addr +
    "&toTokenAddress=" +
    _asset2Addr +
    "&amount=" +
    weiInput +
    "&gasPrice=" +
    gasDefault +
    "&fromAddress=" +
    userWalletAddr;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal[0] = "0";
        returnVal[1] = "";
        returnVal[2] = data.error;
      } else {
        returnVal = [
          data.toTokenAmount,
          data.estimatedGas.toString(),
          "",
          data.tx,
        ];
      }
    });
  return returnVal;
};

export const oneInchSource: SwapSourceProps = {
  id: "1INCH",
  name: "1-inch Network",
  type: "Swap Aggregator",
  imagesq: "https://cryptologos.cc/logos/1inch-1inch-logo.svg",
  imagelg: "https://1inch.io/img/pressRoom/logo.svg",
  integrated: false,
  outputWei: "0",
  gasEstGwei: "",
  loading: false,
  error: "",
  allowance: "0",
};
