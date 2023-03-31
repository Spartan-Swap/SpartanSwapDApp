import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { useAppDispatch } from "../../utils/hooks";

import { getSourceOutputs, useSwap } from "../../state/swapStore";
import { sortDescBN } from "../../utils/helpers/sorting";
import { BN, convertGweiToWei } from "../../utils/helpers/formatting";
import SwapRatesTableItem from "./swapRatesTableItem";

export default function SwapRatesTable() {
  const {
    sources,
    inputUnits,
    asset1,
    asset2,
    cgPriceAsset2,
    cgPriceGasAsset,
  } = useSwap();
  const { address } = useAccount();
  const dispatch = useAppDispatch();
  const provider = useProvider({ chainId: 56 }); // TODO: use whatever chainid/network has been selected in the UI

  const [sourcesSorted, setsourcesSorted] = useState(sources);

  /** Make local copy of sources and sort/filter them */
  useEffect(() => {
    setsourcesSorted(
      [...sources].sort((a, b) => {
        let _totalA = a.outputWei;
        let _totalB = b.outputWei;
        if (
          BN(cgPriceAsset2).isGreaterThan("0") &&
          BN(cgPriceGasAsset).isGreaterThan("0")
        ) {
          _totalA = BN(_totalA)
            .times(cgPriceAsset2)
            .minus(BN(convertGweiToWei(a.gasEstGwei)).times(cgPriceGasAsset))
            .toString();
          _totalB = BN(_totalB)
            .times(cgPriceAsset2)
            .minus(BN(convertGweiToWei(b.gasEstGwei)).times(cgPriceGasAsset))
            .toString();
        }
        return sortDescBN(_totalA, _totalB);
      })
    );
  }, [sources, cgPriceAsset2, cgPriceGasAsset]);

  /** Get the rates from sources every X seconds or on dep changes */
  useEffect(() => {
    const debounceDelay = 500; // Avoid excessive calls from dep-changes (ie. typing fast)
    const intervalDelay = 10000; // Fallback to refresh rates every 10s if no deps change
    const checkRates = () => {
      dispatch(getSourceOutputs(provider, address));
    };
    const timeOutId = setTimeout(() => checkRates(), debounceDelay);
    const interval = setInterval(() => checkRates(), intervalDelay);
    return () => {
      clearTimeout(timeOutId);
      clearInterval(interval);
    };
  }, [dispatch, provider, inputUnits, asset1, asset2, address]);

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 px-2">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {/* TODO: Add sorting by table headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Receive
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Gas
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-2 text-end text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Provider
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sourcesSorted.map((swapSource) => (
                    <SwapRatesTableItem
                      swapSourceItem={swapSource}
                      key={swapSource.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
