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
  signer: Signer,
  allowanceTarget: string
) => {
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
  asset1: AssetProps,
  asset2: AssetProps,
  inputWei: string,
  slippagePC: string, // Slippage PC in units. ie. 1 = 1% ... 0.5 = 0.5% ... etc
  signer: Signer,
  userWalletAddr: string
) => {
  let tx = { to: "", from: "", data: "", value: "", gasPrice: "" };
  const _asset1Addr =
    asset1.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : asset1.address;
  const _asset2Addr =
    asset2.address.toLowerCase() === address0
      ? oneInchNativeAddr
      : asset2.address;
  const queryUrl =
    "https://api.1inch.io/v5.0/56/swap?&fromTokenAddress=" +
    _asset1Addr +
    "&toTokenAddress=" +
    _asset2Addr +
    "&amount=" +
    inputWei +
    "&gasPrice=" +
    gasDefault +
    "&fromAddress=" +
    userWalletAddr +
    "&slippage=" +
    slippagePC;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((txResp) => {
      if (txResp.error) {
        console.log("tx failed", txResp);
        tx = { to: "", from: "", data: "", value: "", gasPrice: "" };
      } else {
        const { to, from, data, value, gasPrice } = txResp.tx;
        tx = { to, from, data, value, gasPrice };
      }
    });

  let txnSuccess = false;
  if (signer && tx.to !== "") {
    await signer.sendTransaction(tx).then((result) => {
      if (result) {
        txnSuccess = true;
      } else {
        console.log("tx failed");
        txnSuccess = false;
      }
    });
  }
  return txnSuccess;
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
