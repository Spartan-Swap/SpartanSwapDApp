import { address0, oneInchNativeAddr } from "../addresses";
import { gasDefault } from "../general";
import { erc20ABI } from "wagmi";
import { Contract } from "ethers";

import type { SwapSourceProps } from "./swapSources";
import type { AssetProps } from "../assets";
import type { Signer, Provider } from "@wagmi/core";

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

export const oneInchSpender = async (allowanceTarget?: string) => {
  if (allowanceTarget && allowanceTarget !== "") {
    return allowanceTarget;
  }
  let returnVal = "";
  const queryUrl = "https://api.1inch.io/v5.0/56/approve/spender";
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal = "";
      } else {
        returnVal = data.address;
      }
    });
  return returnVal;
};

export const oneInchAllowance = async (
  selectedAsset1: AssetProps,
  provider: Provider,
  userWalletAddr: string,
  allowanceTarget: string
) => {
  let returnVal = ""; // A parent function does address0 check prior to this call, not needed here for allowanceTarget
  if (provider) {
    const assetContract = new Contract(
      selectedAsset1.address,
      erc20ABI,
      provider
    );
    if (assetContract) {
      await assetContract.callStatic
        ?.allowance?.(userWalletAddr, allowanceTarget)
        .then((result) => {
          if (result) {
            returnVal = result.toString();
          } else {
            returnVal = "0";
          }
        });
    }
  }
  return returnVal;
};

export const oneInchApprove = async (
  selectedAsset1: AssetProps,
  newAllowanceWei: string,
  signer: Signer
) => {
  let allowanceTarget = "";
  const queryUrl = "https://api.1inch.io/v5.0/56/approve/spender";
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        allowanceTarget = "";
      } else {
        allowanceTarget = data.address;
      }
    });

  let returnVal = false;
  if (signer && allowanceTarget !== "") {
    const assetContract = new Contract(
      selectedAsset1.address,
      erc20ABI,
      signer
    );
    if (assetContract) {
      const ORs = {
        gasPrice: gasDefault,
      };
      await assetContract
        ?.approve?.(allowanceTarget, newAllowanceWei, ORs)
        .then((result: boolean) => {
          if (result) {
            returnVal = result;
          } else {
            returnVal = false;
          }
        });
    }
  }
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
  allowanceTarget: "", // Not required if using API quote call inc user addr
  allowance: "0",
};
