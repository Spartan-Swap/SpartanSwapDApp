import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { BN, convertToWei } from "../utils/helpers/formatting";
import { withTimeout } from "../utils/helpers/promises";
import {
  getSwapSourceQuote,
  swapSources,
} from "../utils/const/swapSources/swapSources";
import {
  parseLocalStorage,
  setLocalStorage,
} from "../utils/helpers/localStorage";
import { bnbAsset, spartaAsset, wbnbAsset } from "../utils/const/assets";
import { oneInchSource } from "../utils/const/swapSources/oneInch";

import type { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import type { SwapSourceProps } from "../utils/const/swapSources/swapSources";
import type { RootState } from "../state/store";
import type { Provider } from "@wagmi/core";
import type { AssetProps } from "../utils/const/assets";
import { address0 } from "../utils/const/addresses";

// Define the initial state using that type
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
    }
    dispatch(updateSourceLoading(false));
  };

/**
 * Get updated list of swap sources with the output rate from the swap params
 * @returns SourceProps[]
 */
export const getSourceOutputs =
  (provider: Provider) =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    dispatch(updateSourceLoading(true));
    // const { provider } = getState().web3; // Once we have provider available in the redux state grab it here instead of handing it in as an arg
    const { sources, asset1, asset2, inputUnits, selectedSource } =
      getState().swap;
    const weiInput = convertToWei(inputUnits);

    try {
      if (sources.length > 0) {
        let awaitArray = [];
        const finalSources = [];

        if (BN(weiInput).isGreaterThan(0)) {
          // Build async await array
          for (let i = 0; i < sources.length; i++) {
            awaitArray.push(
              withTimeout(
                3000,
                getSwapSourceQuote(sources[i]!.id, [
                  asset1,
                  asset2,
                  weiInput,
                  provider,
                  "",
                ])
              )
            );
          }

          // Do async with timeout to get the updated rates
          awaitArray = (await Promise.allSettled(awaitArray)) as {
            status: "fulfilled" | "rejected";
            value: string;
          }[];

          // Update array with results
          for (let i = 0; i < sources.length; i++) {
            if (awaitArray[i]!.status === "fulfilled") {
              finalSources.push({
                ...(sources[i] as SwapSourceProps),
                outputWei: awaitArray[i]!.value[0] ?? "0",
                gasEstGwei: awaitArray[i]!.value[1] ?? "0",
                error: awaitArray[i]!.value[2] ?? "",
              });
            } else {
              finalSources.push({
                ...(sources[i] as SwapSourceProps),
                outputWei: "0",
                gasEstGwei: "0",
                error: "API Issue",
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
    } catch (error: any) {
      console.log(error.toString());
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

export default swapSlice.reducer;
