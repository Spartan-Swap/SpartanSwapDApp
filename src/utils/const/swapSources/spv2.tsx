import ssUtilsAbi from "../../ABIs/56/SPV2/SpartanSwapUtils.json";
import erc20Abi from "../../ABIs/ERC20.json";
import {
  spv2RouterAddr,
  spv2TokenAddr,
  ssUtilsAddr,
} from "../addresses";
import { Contract } from "ethers";

import type { SwapSourceProps } from "./swapSources";
import type { Provider } from "@wagmi/core";
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

export const spv2Allowance = async (
  selectedAsset1: AssetProps,
  provider: Provider,
  userWalletAddr: string
) => {
  // TODO: Add 'allowance' return to SSUtils contract & replace the below
  let returnVal = "";
  if (provider) {
    const assetContract = new Contract(
      selectedAsset1.address,
      erc20Abi.abi,
      provider
    );
    if (assetContract) {
      await assetContract.callStatic
        ?.allowance?.(userWalletAddr, spv2RouterAddr)
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
  provider: Provider
) => {
  // TODO: Add 'approval callData' return to SSUtils contract & replace the below
  let returnVal = false;
  if (provider) {
    const assetContract = new Contract(
      selectedAsset1.address,
      erc20Abi.abi,
      provider
    );
    if (assetContract) {
      await assetContract
        ?.approve?.(spv2RouterAddr, newAllowanceWei)
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

// export const spv2Swap = async (
//   selectedAsset1: AssetProps,
//   newAllowanceWei: string,
//   provider: Provider
// ) => {
//   // TODO: Add 'approval callData' return to SSUtils contract & replace the below
//   let returnVal = false;
//   if (provider) {
//     const assetContract = new Contract(
//       selectedAsset1.address,
//       erc20Abi.abi,
//       provider
//     );
//     if (assetContract) {
//       await assetContract.callStatic
//         ?.approve?.(spv2RouterAddr, newAllowanceWei)
//         .then((result) => {
//           if (result) {
//             returnVal = result;
//           } else {
//             returnVal = false;
//           }
//         });
//     }
//   }
//   return returnVal;
// };

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
  allowance: "0",
};
