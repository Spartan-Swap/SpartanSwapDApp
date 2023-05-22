import { address0, affiliateAddr } from "../addresses";
import { gasDefault } from "../general";
import { Contract } from "ethers";
import { erc20ABI } from "@wagmi/core";

import type { AssetProps } from "../assets";
import type { SwapSourceProps } from "./swapSources";
import type { Provider, Signer } from "@wagmi/core";
import { BN } from "../../helpers/formatting";

const parseZeroExQuoteUrl = (
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
  return queryUrl;
};

export const zeroExQuote = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  let returnVal: [string, string, string, string] = ["", "", "", ""];
  const queryUrl = parseZeroExQuoteUrl(
    selectedAsset1,
    selectedAsset2,
    weiInput
  );
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.reason) {
        returnVal = ["0", "", data.reason, ""];
      } else {
        returnVal = [
          data.buyAmount,
          data.estimatedGas,
          "",
          data.allowanceTarget === address0 ? data.to : data.allowanceTarget,
        ];
      }
    });
  return returnVal;
};

export const zeroExSpender = async (allowanceTarget?: string) => {
  const returnVal = allowanceTarget !== "" ? allowanceTarget : ""; // A parent function does address0 check prior to this call, not needed here for allowanceTarget
  return returnVal;
};

export const zeroExAllowance = async (
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

export const zeroExApprove = async (
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

export const zeroExSwap = async (
  asset1: AssetProps,
  asset2: AssetProps,
  inputWei: string,
  slippagePC: string, // Slippage PC in units. ie. 1 = 1% ... 0.5 = 0.5% ... etc
  signer: Signer,
  userWalletAddr: string
) => {
  const slipConverted = BN(slippagePC).div("100").toString();
  let tx = { to: "", from: "", data: "", value: "", gasPrice: "" };
  const takerString = userWalletAddr ? "&takerAddress=" + userWalletAddr : "";
  const slipString = "&slippagePercentage=" + slipConverted;
  const queryUrl =
    parseZeroExQuoteUrl(asset1, asset2, inputWei) + takerString + slipString;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((txResp) => {
      if (txResp.error) {
        console.log("tx failed", txResp);
        tx = { to: "", from: "", data: "", value: "", gasPrice: "" };
      } else {
        const { to, data, value, gasPrice } = txResp;
        tx = { to, from: userWalletAddr, data, value, gasPrice };
      }
    });

  let txnSuccess = false;
  if (signer && tx) {
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

export const zeroExSource: SwapSourceProps = {
  id: "0X",
  name: "0x",
  type: "Swap Aggregator",
  imagesq: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  imagelg: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  integrated: false,
  outputWei: "0",
  gasEstGwei: "",
  loading: false,
  error: "",
  allowanceTarget: "", // Grabbed dynamically from API quote call
  allowance: "0", // Not grabbed from 0x API call, must be done manually afterwards
};
