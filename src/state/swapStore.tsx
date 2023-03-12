import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { BN, convertToWei } from "../utils/helpers/formatting";
import { withTimeout } from "../utils/helpers/promises";
import {
  getSwapSourceApi,
  oneInchSource,
  swapSources,
} from "../utils/const/swapSources";
import {
  parseLocalStorage,
  setLocalStorage,
} from "../utils/helpers/localStorage";
import { bnbAsset, spartaAsset } from "../utils/const/assets";

import type { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import type { SwapSourceProps } from "../utils/const/swapSources";
import type { RootState } from "../state/store";
import type { Provider } from "@wagmi/core";
import type { AssetProps } from "../utils/const/assets";

// Define the initial state using that type
const initialState = {
  sourcesLoading: false,
  sources: swapSources,
  sourcesError: "",
  selectedSource: oneInchSource,
  asset1: parseLocalStorage("ss_swap_asset1", bnbAsset) as AssetProps,
  asset2: parseLocalStorage("ss_swap_asset2", spartaAsset) as AssetProps,
  input: "",
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
      state.input = action.payload;
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
} = swapSlice.actions;

/**
 * Get updated list of swap sources with the output rate from the swap params
 * @returns SourceProps[]
 */
export const getSourceOutputs =
  (provider: Provider) =>
  async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    dispatch(updateSourceLoading(true));
    // const { provider } = getState().web3; // Once we have provider available in the redux state grab it here instead of handing it in as an arg
    const { sources, asset1, asset2, input, selectedSource } = getState().swap;
    const weiInput = convertToWei(input);

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
                getSwapSourceApi(sources[i]!.id, false, [
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
                outputAmount: awaitArray[i]!.value[0] ?? "0",
                gasEstimate: awaitArray[i]!.value[1] ?? "0",
                error: awaitArray[i]!.value[2] ?? "",
              });
            } else {
              finalSources.push({
                ...(sources[i] as SwapSourceProps),
                outputAmount: "0",
                gasEstimate: "0",
                error: "API Issue",
              });
            }
          }
        } else {
          for (let i = 0; i < sources.length; i++) {
            finalSources.push({
              ...(sources[i] as SwapSourceProps),
              outputAmount: "0",
              gasEstimate: "0",
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

export default swapSlice.reducer;
