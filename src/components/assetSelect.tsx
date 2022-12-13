import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export type AssetSelectProps = {
  assetId: number;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export type AssetProps = {
  id: number;
  name: string;
  ticker: string;
  site: string;
  decmials: number;
  logo: string;
};

const assets = [
  {
    id: 1,
    name: "Wrapped BNB",
    ticker: "WBNB",
    site: "https://www.binance.org/",
    decmials: 18,
    logo: "https://bscscan.com/token/images/binance_32.png",
  },
  {
    id: 2,
    name: "Spartan Protocol Token V2",
    ticker: "SPARTA",
    site: "https://spartanprotocol.org/",
    decmials: 18,
    logo: "https://bscscan.com/token/images/spartan2_32.png",
  },
  {
    id: 3,
    name: "Trust Wallet",
    ticker: "TWT",
    site: "https://trustwallet.com/",
    decmials: 18,
    logo: "https://bscscan.com/token/images/trust_32.png",
  },
  {
    id: 4,
    name: "Binance-Peg BUSD Token",
    ticker: "BUSD",
    site: "https://www.binance.com/en/busd",
    decmials: 18,
    logo: "https://bscscan.com/token/images/busd_32_2.png",
  },
  // More assets...
];

const recent = [assets[1], assets[3], assets[2]];

function classNames(...classes: string[]) {
  return classes.join(" ");
}

export default function AssetSelect({
  assetId,
  isOpen,
  setOpen,
}: AssetSelectProps) {
  const [query, setQuery] = useState("");

  const filteredAssets =
    query === ""
      ? []
      : assets.filter((asset: AssetProps) => {
          return asset.ticker.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root
      show={isOpen}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(asset: AssetProps) =>
                  console.log(
                    asset.ticker,
                    "TODO: Change the selected asset state"
                  )
                }
              >
                {({ activeOption }) => (
                  <>
                    <div className="relative">
                      <MagnifyingGlassIcon
                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Combobox.Input
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search..."
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>

                    {(query === "" || filteredAssets.length > 0) && (
                      <Combobox.Options
                        as="div"
                        static
                        hold
                        className="flex divide-x divide-gray-100"
                      >
                        <div
                          className={classNames(
                            "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4",
                            activeOption ? "sm:h-96" : ""
                          )}
                        >
                          {query === "" && (
                            <h2 className="mt-2 mb-4 text-xs font-semibold text-gray-500">
                              Recent searches
                            </h2>
                          )}
                          <div className="-mx-2 text-sm text-gray-700">
                            {(query === "" ? recent : filteredAssets).map(
                              (asset) => (
                                <Combobox.Option
                                  as="div"
                                  key={asset?.id}
                                  value={asset}
                                  className={({ active }) =>
                                    classNames(
                                      "flex cursor-default select-none items-center rounded-md p-2",
                                      active ? "bg-gray-100 text-gray-900" : ""
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
                                          className="ml-3 h-5 w-5 flex-none text-gray-400"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              )
                            )}
                          </div>
                        </div>

                        {activeOption && (
                          <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                            <div className="flex-none p-6 text-center">
                              <img
                                src={activeOption.logo}
                                alt=""
                                className="mx-auto h-16 w-16 rounded-full"
                              />
                              <h2 className="mt-3 font-semibold text-gray-900">
                                {activeOption.name}
                              </h2>
                              <p className="text-sm leading-6 text-gray-500">
                                {activeOption.ticker}
                              </p>
                            </div>
                            <div className="flex flex-auto flex-col justify-between p-6">
                              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                <dt className="col-end-1 font-semibold text-gray-900">
                                  URL
                                </dt>
                                <dd className="truncate">
                                  <a
                                    href={activeOption.site}
                                    className="text-indigo-600 underline"
                                  >
                                    {activeOption.site}
                                  </a>
                                </dd>
                              </dl>
                              <span>
                                <button
                                  type="button"
                                  className="mt-6 w-2/4 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  Select
                                </button>
                                <button
                                  type="button"
                                  className="mt-6 w-2/4 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  View BSCScan
                                </button>
                              </span>
                            </div>
                          </div>
                        )}
                      </Combobox.Options>
                    )}

                    {query !== "" && filteredAssets.length === 0 && (
                      <div className="py-14 px-6 text-center text-sm sm:px-14">
                        <UsersIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-4 font-semibold text-gray-900">
                          No people found
                        </p>
                        <p className="mt-2 text-gray-500">
                          We couldn’t find anything with that term. Please try
                          again.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
