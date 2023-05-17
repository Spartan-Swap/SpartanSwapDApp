import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  BN,
  convertToWei,
  formatFromWei,
  shortenString,
} from "../utils/helpers/formatting";
import { withTimeout } from "../utils/helpers/promises";
import {
  getSwapSourceAllowance,
  getSwapSourceQuote,
  getSwapSourceSpender,
  swapSources,
} from "../utils/const/swapSources/swapSources";
import {
  parseLocalStorage,
  setLocalStorage,
} from "../utils/helpers/localStorage";
import { bnbAsset, spartaAsset, wbnbAsset } from "../utils/const/assets";
import { oneInchSource } from "../utils/const/swapSources/oneInch";
import { address0 } from "../utils/const/addresses";

import type { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import type { SwapSourceProps } from "../utils/const/swapSources/swapSources";
import type { RootState } from "../state/store";
import type { Provider } from "@wagmi/core";
import type { AssetProps } from "../utils/const/assets";

export type SwapStepProps = {
  name: string;
  description: string;
  href: string;
  status: string;
};

const swapStep1Default = {
  name: "Approve Token",
  description: "Allow a contract to handle your token",
  href: "#",
  status: "current",
};

const swapStep2Default = {
  name: "Set Minimum Amount",
  description:
    "You should set a min amount so that the transaction cancels if you get sandwich attacked.",
  href: "#",
  status: "upcoming",
};

const swapStep3Default = {
  name: "Sign Transaction",
  description: "Sign and finalise the transaction",
  href: "#",
  status: "upcoming",
};

const initialState = {
  sourcesLoading: false,
  sources: swapSources,
  sourcesError: "",
  selectedSource: oneInchSource,
  asset1: parseLocalStorage("ss_swap_asset1", bnbAsset) as AssetProps,
  asset2: parseLocalStorage("ss_swap_asset2", spartaAsset) as AssetProps,
  inputUnits: "",
  cgPriceGasAsset: "",
  cgPriceAsset1: "",
  cgPriceAsset2: "",
  swapStep1: swapStep1Default,
  swapStep2: swapStep2Default,
  swapStep3: swapStep3Default,
};

export const useSwap = () => useSelector((state: RootState) => state.swap);

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    updateSourceLoading: (state, action: PayloadAction<boolean>) => {
      state.sourcesLoading = action.payload;
    },
    updateSourceOutputs: (state, action: PayloadAction<SwapSourceProps[]>) => {
      state.sources = action.payload;
    },
    updateSourceError: (state, action: PayloadAction<string>) => {
      state.sourcesError = action.payload;
    },
    updateSelectedSource: (state, action: PayloadAction<SwapSourceProps>) => {
      state.selectedSource = action.payload;
    },
    updateSwapAsset1: (state, action: PayloadAction<AssetProps>) => {
      state.asset1 = action.payload;
      setLocalStorage("ss_swap_asset1", action.payload);
    },
    updateSwapAsset2: (state, action: PayloadAction<AssetProps>) => {
      state.asset2 = action.payload;
      setLocalStorage("ss_swap_asset2", action.payload);
    },
    updateSwapInput: (state, action: PayloadAction<string>) => {
      state.inputUnits = action.payload;
    },
    updateCgPriceGasAsset: (state, action: PayloadAction<string>) => {
      state.cgPriceGasAsset = action.payload;
    },
    updateCgPriceAsset1: (state, action: PayloadAction<string>) => {
      state.cgPriceAsset1 = action.payload;
    },
    updateCgPriceAsset2: (state, action: PayloadAction<string>) => {
      state.cgPriceAsset2 = action.payload;
    },
    updateSwapStep1: (state, action: PayloadAction<SwapStepProps>) => {
      state.swapStep1 = action.payload;
    },
    updateSwapStep2: (state, action: PayloadAction<SwapStepProps>) => {
      state.swapStep2 = action.payload;
    },
    updateSwapStep3: (state, action: PayloadAction<SwapStepProps>) => {
      state.swapStep3 = action.payload;
    },
  },
});

export const {
  updateSourceLoading,
  updateSourceOutputs,
  updateSourceError,
  updateSelectedSource,
  updateSwapAsset1,
  updateSwapAsset2,
  updateSwapInput,
  updateCgPriceGasAsset,
  updateCgPriceAsset1,
  updateCgPriceAsset2,
  updateSwapStep1,
  updateSwapStep2,
  updateSwapStep3,
} = swapSlice.actions;

/**
 * Reset swap outputs
 * @returns SourceProps[]
 */
export const resetSwapOutputs =
  () =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    dispatch(updateSourceLoading(true));
    const { sources, selectedSource } = getState().swap;

    try {
      if (sources.length > 0) {
        const finalSources = [];

        for (let i = 0; i < sources.length; i++) {
          finalSources.push({
            ...(sources[i] as SwapSourceProps),
            outputWei: "0",
            gasEstGwei: "0",
            error: "",
            allowanceTarget: "",
            allowance: "0",
          });
        }

        dispatch(updateSourceOutputs(finalSources));
        if (selectedSource) {
          dispatch(changeSelectedSource(selectedSource.id));
        }
      }
    } catch (error: any) {
      dispatch(updateSourceError(error.toString()));
      dispatch(changeSelectedSource(selectedSource.id));
      dispatch(changeSwapStep1());
    }
    dispatch(updateSourceLoading(false));
  };

/**
 * Get updated list of swap sources with the output rate from the swap params
 * @returns SourceProps[]
 */
export const getSourceOutputs =
  (provider: Provider, userWalletAddr?: string) =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    dispatch(updateSourceLoading(true));
    // const { provider } = getState().web3; // Once we have provider available in the redux state grab it here instead of handing it in as an arg
    const { sources, asset1, asset2, inputUnits, selectedSource } =
      getState().swap;
    const weiInput = convertToWei(inputUnits);

    try {
      if (sources.length > 0) {
        let quoteArray = [];
        let spenderArray = [];
        let allowanceArray = [];
        const finalSources = [];

        if (BN(weiInput).isGreaterThan(0)) {
          // Build async await array starting with quotes
          for (let i = 0; i < sources.length; i++) {
            quoteArray.push(
              withTimeout(
                3000,
                getSwapSourceQuote(sources[i]!.id, [
                  asset1,
                  asset2,
                  weiInput,
                  provider,
                ])
              )
            );
          }

          // Do async with timeout to get the updated rates
          quoteArray = (await Promise.allSettled(quoteArray)) as {
            status: "fulfilled" | "rejected";
            value: string;
          }[];

          // Build separate spender checking array
          for (let i = 0; i < sources.length; i++) {
            spenderArray.push(
              withTimeout(
                3000,
                getSwapSourceSpender(sources[i]!.id, [
                  provider,
                  quoteArray[i]!.value[3] ?? "",
                ])
              )
            );
          }

          // Do async with timeout to get the updated spender addresses
          spenderArray = (await Promise.allSettled(spenderArray)) as {
            status: "fulfilled" | "rejected";
            value: string;
          }[];

          // Build separate allowance checking array.
          // Some calls require knowing result of the quote ...
          // ... api call to know the target allowance address
          //
          if (userWalletAddr) {
            for (let i = 0; i < sources.length; i++) {
              allowanceArray.push(
                withTimeout(
                  3000,
                  getSwapSourceAllowance(sources[i]!.id, [
                    asset1,
                    provider,
                    userWalletAddr,
                    spenderArray[i]!.value,
                  ])
                )
              );
            }
          }

          // Do async with timeout to get the updated allowances
          allowanceArray = (await Promise.allSettled(allowanceArray)) as {
            status: "fulfilled" | "rejected";
            value: string;
          }[];

          // Update array with results
          for (let i = 0; i < sources.length; i++) {
            if (quoteArray[i]!.status === "fulfilled") {
              finalSources.push({
                ...(sources[i] as SwapSourceProps),
                outputWei: quoteArray[i]!.value[0] ?? "0",
                gasEstGwei: quoteArray[i]!.value[1] ?? "0",
                error: quoteArray[i]!.value[2] ?? "",
                allowanceTarget: spenderArray[i]!.value ?? "",
                allowance: userWalletAddr
                  ? allowanceArray[i]?.value ?? "0"
                  : "0",
              });
            } else {
              finalSources.push({
                ...(sources[i] as SwapSourceProps),
                outputWei: "0",
                gasEstGwei: "0",
                error: "API Issue",
                allowanceTarget: "",
                allowance: "0",
              });
            }
          }
        } else {
          for (let i = 0; i < sources.length; i++) {
            finalSources.push({
              ...(sources[i] as SwapSourceProps),
              outputWei: "0",
              gasEstGwei: "0",
              error: "",
              allowanceTarget: "",
              allowance: "0",
            });
          }
        }
        dispatch(updateSourceOutputs(finalSources));
        if (selectedSource) {
          dispatch(changeSelectedSource(selectedSource.id));
        }
      }
    } catch (error: any) {
      dispatch(updateSourceError(error.toString()));
      dispatch(changeSelectedSource(selectedSource.id));
    }
    dispatch(updateSourceLoading(false));
  };

/**
 * Get updated source reference based on user selection
 * @returns SwapSourceProps
 */
export const changeSelectedSource =
  (sourceID: string) =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const { sources } = getState().swap;

    try {
      if (sources.length > 0) {
        const selectedIndex = sources.findIndex(
          (source) => source.id === sourceID
        );
        if (selectedIndex !== -1) {
          dispatch(
            updateSelectedSource(sources[selectedIndex] as SwapSourceProps)
          );
        } else {
          console.log(
            "Swap source ID (" +
              sourceID +
              ") not found during changeSelectedSource in swap store"
          );
        }
      }
      dispatch(changeSwapStep1());
    } catch (error: any) {
      console.log(error.toString());
      dispatch(changeSwapStep1());
    }
  };

/**
 * Get updated coingecko prices for selected assets & native gas token for selected network
 * Use wrapped version of native gas asset to allow us to use a single API call
 * (ie. on BSC use WBNB || on ethereum use WETH)
 * @returns string
 */
export const changeCgAssetPrice =
  () =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const { asset1, asset2 } = getState().swap;
    const _asset1 = asset1.address === address0 ? wbnbAsset : asset1;
    const _asset2 = asset2.address === address0 ? wbnbAsset : asset2;

    try {
      const queryUrl =
        // TODO: Select 'binance-smart-chain' etc based on selected network
        "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=" +
        wbnbAsset.address +
        "," +
        _asset1.address +
        "," +
        _asset2.address +
        "&vs_currencies=usd";
      await fetch(queryUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.log("error", data.error);
            // returnVal = ["0", "", data.error];
          } else {
            const gasAssetPrice =
              data[wbnbAsset.address.toLowerCase()]?.usd?.toString() ?? "";
            const asset1Price =
              data[_asset1.address.toLowerCase()]?.usd?.toString() ?? "";
            const asset2Price =
              data[_asset2.address.toLowerCase()]?.usd?.toString() ?? "";
            dispatch(updateCgPriceGasAsset(gasAssetPrice));
            dispatch(updateCgPriceAsset1(asset1Price));
            dispatch(updateCgPriceAsset2(asset2Price));
          }
        });
    } catch (error: any) {
      console.log(error.toString());
    }
  };

export const changeSwapStep1 =
  () =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const { asset1, selectedSource, inputUnits } = getState().swap;

    try {
      const newStepObj = {
        name: "Approve " + asset1.ticker,
        description:
          "Allow " +
          (["", address0].includes(selectedSource.allowanceTarget)
            ? "a contract"
            : shortenString(selectedSource.allowanceTarget)) +
          " to handle your " +
          asset1.ticker,
        href: "#",
        status: BN(selectedSource.allowance).isGreaterThanOrEqualTo(
          convertToWei(inputUnits)
        )
          ? "complete"
          : "current",
      };
      dispatch(updateSwapStep1(newStepObj));
      dispatch(changeSwapStep2());
    } catch (error: any) {
      console.log(error.toString());
    }
  };

export const changeSwapStep2 =
  () =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const { asset2, selectedSource, swapStep1 } = getState().swap;

    try {
      const newStepObj = {
        name: "Set Minimum Amount",
        description:
          "You should set a min amount so that the transaction cancels if you get sandwich attacked. Current estimate: " +
          formatFromWei(selectedSource.outputWei) +
          " " +
          asset2.ticker,
        href: "#",
        status: swapStep1.status === "complete" ? "current" : "upcoming",
      };
      dispatch(updateSwapStep2(newStepObj));
    } catch (error: any) {
      console.log(error.toString());
    }
  };

export default swapSlice.reducer;
