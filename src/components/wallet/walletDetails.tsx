import { Combobox } from "@headlessui/react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";

import { useState } from "react";
import { assets } from "../assetSelect";

import type { AssetProps } from "../assetSelect";
import { classNames, shortenString } from "../../utils/formatting";

const recent = [assets[1], assets[3], assets[2]];

export function WalletDetails() {
  const { address, connector } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  const [query, setQuery] = useState("");

  const filteredAssets =
    query === ""
      ? []
      : assets.filter((asset: AssetProps) => {
          return asset.ticker.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Combobox
        onChange={(asset: AssetProps) =>
          console.log(asset.ticker, "TODO: Change the selected asset state")
        }
      >
        {({ activeOption }) => (
          <>
            <div className="relative">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              <Combobox.Input
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 sm:text-sm"
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {(query === "" || filteredAssets.length > 0) && (
              <Combobox.Options
                as="div"
                static
                hold
                className="flex divide-x divide-gray-500 divide-opacity-20"
              >
                <div
                  className={classNames(
                    "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4",
                    activeOption ? "sm:h-96" : ""
                  )}
                >
                  {query === "" && (
                    <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">
                      Recent searches
                    </h2>
                  )}
                  <div className="-mx-2 text-sm text-gray-400">
                    {(query === "" ? recent : filteredAssets).map((asset) => (
                      <Combobox.Option
                        as="div"
                        key={asset?.id}
                        value={asset}
                        className={({ active }) =>
                          classNames(
                            "flex cursor-default select-none items-center rounded-md p-2",
                            active ? "bg-gray-800 text-white" : ""
                          )
                        }
                      >
                        {({ active }) => (
                          <>
                            <img
                              src={asset?.logo}
                              alt=""
                              className="h-6 w-6 flex-none rounded-full"
                            />
                            <span className="ml-3 flex-auto truncate">
                              {asset?.name}
                            </span>
                            {active && (
                              <ChevronRightIcon
                                className="ml-3 h-5 w-5 flex-none text-gray-300"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                </div>

                <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-500 divide-opacity-20 overflow-y-auto sm:flex">
                  <div className="flex-none p-6 text-center">
                    {ensAvatar && (
                      <img
                        src={ensAvatar}
                        alt="ENS Avatar"
                        className="mx-auto h-16 w-16 rounded-full"
                      />
                    )}
                    <h2 className="mt-3 font-semibold text-gray-300">
                      {ensName}
                    </h2>
                    <p className="text-sm leading-6 text-gray-500">
                      {address && shortenString(address)}
                    </p>
                    <span>
                      <DocumentDuplicateIcon
                        className="inline h-5 w-5 text-gray-300"
                        aria-hidden="true"
                        // onClick={() => TODO: Copy the address to clipboard }
                      />
                      <ArrowTopRightOnSquareIcon
                        className="inline h-5 w-5 text-gray-300"
                        aria-hidden="true"
                        // onClick={() => TODO: Open wallet in explorer }
                      />
                    </span>
                  </div>

                  <div className="flex flex-auto flex-col justify-between p-6">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-400">
                      <dt className="col-end-1 font-semibold text-gray-300">
                        Connected to
                      </dt>
                      <dd className="truncate">{connector?.name}</dd>
                    </dl>
                    <button
                      type="button"
                      className="mt-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </Combobox.Options>
            )}

            {query !== "" && filteredAssets.length === 0 && (
              <div className="py-14 px-6 text-center text-sm sm:px-14">
                <UsersIcon
                  className="mx-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-gray-900">
                  No assets found
                </p>
                <p className="mt-2 text-gray-500">
                  We couldn’t find anything with that term. Please try again.
                </p>
              </div>
            )}
          </>
        )}
      </Combobox>
    </>
  );
}
