import ssUtilsAbi from "../../ABIs/56/SPV2/SpartanSwapUtils.json";
import spv2TokenAbi from "../../ABIs/56/SPV2/Sparta.json";
import spv2RouterAbi from "../../ABIs/56/SPV2/Router.json";
import {
  address0,
  spv2RouterAddr,
  spv2TokenAddr,
  ssUtilsAddr,
} from "../addresses";
import { Contract } from "ethers";
import { erc20ABI } from "@wagmi/core";
import { gasDefault } from "../general";

import type { Provider, Signer } from "@wagmi/core";
import type { SwapSourceProps } from "./swapSources";
import type { AssetProps } from "../assets";

// TODO: Update SSwap API quote endpoint to include calldata via SP router
export const spv2Quote = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  provider: Provider | undefined
) => {
  const gasEst = [
    selectedAsset1.address.toLowerCase(),
    selectedAsset2.address.toLowerCase(),
  ].includes(spv2TokenAddr.toLowerCase())
    ? "230000" // Single-swap gas estimate
    : "320000"; // Double-swap gas estimate
  let returnVal: [string, string, string] = ["", "", ""];
  if (provider) {
    const quoteSPV2Contract = new Contract(
      ssUtilsAddr,
      ssUtilsAbi.abi,
      provider
    );
    if (quoteSPV2Contract) {
      await quoteSPV2Contract.callStatic
        ?.getSwapOutput?.(
          selectedAsset1.address,
          selectedAsset2.address,
          weiInput
        )
        .then((result) => {
          if (result) {
            returnVal = [result.toString(), gasEst, ""];
          } else {
            returnVal = ["0", "", "Error"];
          }
        });
    }
  }
  return returnVal;
};

export const spv2Spender = async (
  provider: Provider,
  allowanceTarget?: string
) => {
  // TODO: Add 'spenderAddr' return to SSUtils contract to bypass the below RPC call is 'quote' is done first
  if (allowanceTarget && allowanceTarget !== "") {
    return allowanceTarget;
  }
  let returnVal = "";
  if (provider) {
    const assetContract = new Contract(
      spv2TokenAddr,
      spv2TokenAbi.abi,
      provider
    );
    if (assetContract) {
      await assetContract.callStatic?.DAO?.().then((result) => {
        if (result) {
          returnVal = result.toString();
        } else {
          returnVal = "";
        }
      });
    }
  }
  return returnVal;
};

export const spv2Allowance = async (
  selectedAsset1: AssetProps,
  provider: Provider,
  userWalletAddr: string,
  allowanceTarget: string
) => {
  // TODO: Add 'allowance' return to SSUtils contract & replace the below
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

export const spv2Approve = async (
  selectedAsset1: AssetProps,
  newAllowanceWei: string,
  signer: Signer
) => {
  // TODO: Add 'approval callData' return to SSUtils contract & replace the below
  let returnVal = false;
  if (signer) {
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
        ?.approve?.(spv2RouterAddr, newAllowanceWei, ORs)
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

export const spv2Swap = async (
  asset1: AssetProps,
  asset2: AssetProps,
  inputWei: string,
  minAmountWei: string,
  signer: Signer
) => {
  // TODO: Add 'swap txn callData' return to SSUtils contract & replace the below
  let returnVal = false;
  if (signer) {
    const routerContract = new Contract(
      spv2RouterAddr,
      spv2RouterAbi.abi,
      signer
    );
    if (routerContract) {
      const ORs = {
        value: asset1.address === address0 ? inputWei : null,
        gasPrice: gasDefault,
      };
      await routerContract
        ?.swap?.(inputWei, asset1.address, asset2.address, minAmountWei, ORs)
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

export const spv2Source: SwapSourceProps = {
  id: "SPV2",
  name: "Spartan Protocol V2",
  type: "Automated Market Maker",
  imagesq:
    "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/spartav2.svg",
  imagelg:
    "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/sparta-text-short.svg",
  integrated: false,
  outputWei: "0",
  gasEstGwei: "",
  loading: false,
  error: "",
  allowanceTarget: spv2RouterAddr,
  allowance: "0",
};
