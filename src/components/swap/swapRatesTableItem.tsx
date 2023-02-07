import { CoinGeckoLogoTemp } from "../../utils/swapSources";
import { BN, convertToWei, formatFromWei } from "../../utils/formatting";

import { allSwapRatesTableItemAtoms as atoms } from "../../state/globalStore";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useProvider } from "wagmi";

import type { SwapSourceProps } from "../../utils/swapSources";
import type { PrimitiveAtom } from "jotai";

type SwapRatesTableItemProps = {
  swapSourceItem: PrimitiveAtom<SwapSourceProps>;
};

export default function SwapRatesTableItem({
  swapSourceItem,
}: SwapRatesTableItemProps) {
  const provider = useProvider({ chainId: 56 }); // TODO: use whatever chainid/network has been selected in the UI

  const [selectedSource, setSelectedSource] = useAtom(atoms.selectedSourceAtom);
  const [swapSource, setSwapSource] = useAtom(swapSourceItem);
  const [inputAmount] = useAtom(atoms.inputAmountAtom);
  const [selectedAsset1] = useAtom(atoms.selectedAsset1Atom);
  const [selectedAsset2] = useAtom(atoms.selectedAsset2Atom);

  /** Get new rate/quote every x seconds with a debounce delay to reduce API calls
   * Clear & re-calc whenever the inputAmount or selectedAssets change
   */
  useEffect(() => {
    const debounceDelay = 500;
    const intervalDelay = 10000;

    const extCallFn = async () => {
      const weiInput = convertToWei(inputAmount);
      if (BN(weiInput).isGreaterThan(0)) {
        // If chainId === 56 (BSC)
        const theCall = swapSource.extCall(
          selectedAsset1.address,
          selectedAsset2.address,
          weiInput,
          provider
        );
        const [outputAmount, errorMsg] = await theCall;
        if (outputAmount !== "") {
          const prevItem = swapSource;
          prevItem.outputAmount = outputAmount;
          prevItem.error = errorMsg;
          setSwapSource(prevItem);
        }
        // If chainId === eth
        // If chainId === etc.etc.etc
        // setLoading(false); // TODO: CHANGE TO A LOCAL ISLOADING STATE INSIDE THE CURRECT SWAP SOURCE ITEM
      } else {
        const prevItem = swapSource;
        prevItem.outputAmount = "0";
        prevItem.error = "";
        setSwapSource(prevItem);
      }
    };
    const timeOutId = setTimeout(() => extCallFn(), debounceDelay);
    const interval = setInterval(() => extCallFn(), intervalDelay);
    return () => {
      clearTimeout(timeOutId);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAmount, selectedAsset1, selectedAsset2]);

  return (
    <>
      <tr
        onClick={() => setSelectedSource(swapSource.id)}
        role="button"
        className={
          selectedSource === swapSource.id
            ? "z-10 border-indigo-200 bg-indigo-50"
            : ""
        }
      >
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {!swapSource.error ? (
            <div className="text-gray-900">
              {formatFromWei(swapSource.outputAmount)}
              <div className="ml-1 inline text-xs text-gray-500">
                {selectedAsset2.ticker}
              </div>
            </div>
          ) : (
            <div className="text-gray-900">{swapSource.error}</div>
          )}
          <div className="text-xs text-gray-500">
            ~$00,000.00
            <div className="ml-1 inline-block h-4 w-4 align-top">
              <CoinGeckoLogoTemp />
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <div className="text-gray-900">
            00.0000
            <div className="ml-1 inline text-xs text-gray-500">
              {/* IF CHAIN === 56 etc */}
              BNB
            </div>
          </div>
          <div className="text-xs text-gray-500">
            ~$0.00
            <div className="ml-1 inline-block h-4 w-4 align-top">
              <CoinGeckoLogoTemp />
            </div>
          </div>
        </td>
        <td
          className="relative whitespace-nowrap py-4 pl-4 pr-2 text-sm sm:pl-6"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)),url('${swapSource.imagesq}')`,
            backgroundSize: "cover",
          }}
        >
          <div className="flex justify-end text-end">
            <div className="">
              <div className="font-medium text-gray-900">{swapSource.name}</div>
              <div className="text-xs text-gray-500">{swapSource.type}</div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
