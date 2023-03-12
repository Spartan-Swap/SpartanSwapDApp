import { CoinGeckoLogoTemp } from "../../utils/const/swapSources";
import {
  BN,
  classNames,
  convertFromGwei,
  formatFromGwei,
  formatFromWei,
} from "../../utils/helpers/formatting";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { gasDefault } from "../../utils/const/general";
import { changeSelectedSource, useSwap } from "../../state/swapStore";
import { useAppDispatch } from "../../utils/hooks";

import type { SwapSourceProps } from "../../utils/const/swapSources";

type SwapRatesTableItemProps = {
  swapSourceItem: SwapSourceProps;
};

export default function SwapRatesTableItem({
  swapSourceItem,
}: SwapRatesTableItemProps) {
  const dispatch = useAppDispatch();
  const { asset2, sourcesLoading, selectedSource } = useSwap();

  return (
    <>
      <tr
        onClick={() => dispatch(changeSelectedSource(swapSourceItem.id))}
        role="button"
        className={
          selectedSource.id === swapSourceItem.id
            ? "z-10 border-indigo-200 bg-indigo-50"
            : ""
        }
      >
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {!swapSourceItem.error ? (
            <div className="text-gray-900">
              {formatFromWei(swapSourceItem.outputAmount)}
              <div className="ml-1 inline text-xs text-gray-500">
                {asset2.ticker}
              </div>
            </div>
          ) : (
            <div className="text-gray-900">{swapSourceItem.error}</div>
          )}
          <div className="text-xs text-gray-500">
            ~$?
            <div className="ml-1 inline-block h-4 w-4 align-top">
              <CoinGeckoLogoTemp />
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <div className="text-gray-900">
            {swapSourceItem.gasEstimate !== ""
              ? formatFromGwei(
                  BN(convertFromGwei(gasDefault))
                    .times(swapSourceItem.gasEstimate)
                    .toString()
                )
              : ""}
            <div className="ml-1 inline text-xs text-gray-500">
              {/* IF CHAIN === 56 etc */}
              {swapSourceItem.gasEstimate !== "" ? "BNB" : "Unknown"}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            ~${swapSourceItem.gasEstimate !== "" ? "?" : "?"}
            <div className="ml-1 inline-block h-4 w-4 align-top">
              <CoinGeckoLogoTemp />
            </div>
          </div>
        </td>
        <td
          className="relative whitespace-nowrap py-4 pl-4 pr-2 text-sm sm:pl-6"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)),url('${swapSourceItem.imagesq}')`,
            backgroundSize: "cover",
          }}
        >
          <div className="flex justify-end text-end">
            <div className="">
              <div className="font-medium text-gray-900">
                <ArrowPathIcon
                  className={classNames(
                    "ml-1 mb-1 inline h-3 w-3 text-gray-700",
                    sourcesLoading ? "animate-spin" : ""
                  )}
                  aria-hidden="true"
                  role="button"
                />
                {swapSourceItem.name}
              </div>
              <div className="text-xs text-gray-500">{swapSourceItem.type}</div>
            </div>
          </div>
        </td>
      </tr>
      {!swapSourceItem.integrated && (
        <tr className="text-center text-xs text-gray-500">
          <td colSpan={3}>{swapSourceItem.name} integration coming soon...</td>
        </tr>
      )}
    </>
  );
}
