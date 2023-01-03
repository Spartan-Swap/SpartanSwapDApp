import { CoinGeckoLogoTemp } from "../../utils/swapSources";
import { formatFromWei } from "../../utils/formatting";

import type { SwapSourceProps } from "../../utils/swapSources";
import type { AssetProps } from "../assetSelect";

type SwapRatesTableProps = {
  sources: SwapSourceProps[];
  setSelectedSource: (value: string) => void;
  selectedSource: string;
  selectedAsset2: AssetProps;
};

export default function SwapRatesTable({
  sources,
  setSelectedSource,
  selectedSource,
  selectedAsset2,
}: SwapRatesTableProps) {
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
                    <th
                      scope="col"
                      className="py-2 px-2 text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Logo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sources.map((swapSource) => (
                    <tr
                      key={swapSource.id}
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
                          <div className="text-gray-900">
                            {swapSource.error}
                          </div>
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
                      <td className="whitespace-nowrap py-4 pl-4 pr-2 text-sm sm:pl-6">
                        <div className="flex justify-end text-end">
                          <div className="">
                            <div className="font-medium text-gray-900">
                              {swapSource.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {swapSource.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 text-sm sm:pl-6">
                        <div className="flex justify-end text-end">
                          <div className="my-auto h-10 flex-shrink-0">
                            <img
                              className="h-10 rounded-sm"
                              src={swapSource.imagesq}
                              alt=""
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
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
