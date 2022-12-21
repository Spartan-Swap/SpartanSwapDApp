import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { shortenString } from "../utils/formatting";

import type { Address } from "wagmi";

export type AssetSelectProps = {
  selectedAsset: AssetProps;
  setSelectedAsset: (value: AssetProps) => void;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

type AllowedTags = "Native Coin" | "Non-Native Coin" | "Token" | "Stablecoin";

export type AssetProps = {
  name: string;
  ticker: string;
  address: Address;
  site: string;
  decimals: number;
  logo: string;
  tags: AllowedTags[];
};

export const bnbAsset: AssetProps = {
  name: "Wrapped BNB",
  ticker: "WBNB",
  address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  site: "https://www.binance.org/",
  decimals: 18,
  logo: "https://bscscan.com/token/images/binance_32.png",
  tags: ["Native Coin"],
};

export const spartaAsset: AssetProps = {
  name: "Spartan Protocol Token V2",
  ticker: "SPARTA",
  address: "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102",
  site: "https://spartanprotocol.org/",
  decimals: 18,
  logo: "https://bscscan.com/token/images/spartan2_32.png",
  tags: ["Token"],
};

export const assets: AssetProps[] = [
  bnbAsset,
  spartaAsset,
  {
    name: "Trust Wallet Token",
    ticker: "TWT",
    address: "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
    site: "https://trustwallet.com/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/trust_32.png",
    tags: ["Token"],
  },
  {
    name: "Binance-Peg BUSD Token",
    ticker: "BUSD",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    site: "https://www.binance.com/en/busd",
    decimals: 18,
    logo: "https://bscscan.com/token/images/busd_32_2.png",
    tags: ["Token", "Stablecoin"],
  },
  {
    name: "Binance-Peg USD Coin",
    ticker: "USDC",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    site: "https://www.centre.io/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/centre-usdc_28.png",
    tags: ["Token", "Stablecoin"],
  },
  {
    name: "Binance-Peg BSC-USD",
    ticker: "USDT",
    address: "0x55d398326f99059fF775485246999027B3197955",
    site: "https://tether.to/en/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/busdt_32.png",
    tags: ["Token", "Stablecoin"],
  },
  {
    name: "Binance-Peg BTCB Token",
    ticker: "BTCB",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    site: "https://bitcoin.org/en/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/btcb_32.png",
    tags: ["Non-Native Coin"],
  },
  // More assets...
];

const recent = [assets[6], assets[4], assets[2], assets[0], assets[3]];

function classNames(...classes: string[]) {
  return classes.join(" ");
}

export default function AssetSelect({
  selectedAsset,
  setSelectedAsset,
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
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
              <Combobox
                value={selectedAsset}
                onChange={(asset) => setSelectedAsset(asset)}
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
                          <div className="-mx-2 text-sm text-gray-400">
                            <div className="flex flex-wrap">
                              {query === "" &&
                                recent.map(
                                  (asset) =>
                                    asset && (
                                      <Combobox.Option
                                        as="div"
                                        key={asset.address}
                                        value={asset}
                                        className={({ selected, active }) =>
                                          classNames(
                                            "flex-1 cursor-default select-none items-center rounded-md p-2 text-center",
                                            selected
                                              ? "bg-gray-800 text-white"
                                              : "",
                                            active ? "bg-gray-800" : ""
                                          )
                                        }
                                      >
                                        <img
                                          src={asset?.logo}
                                          alt=""
                                          className="mx-auto h-6 w-6 flex-none rounded-full"
                                        />
                                        {asset?.ticker}
                                      </Combobox.Option>
                                    )
                                )}
                            </div>
                            <hr className="my-2 border-gray-500 border-opacity-20" />
                            {(query === "" ? assets : filteredAssets).map(
                              (asset) =>
                                asset && (
                                  <Combobox.Option
                                    as="div"
                                    key={asset.address}
                                    value={asset}
                                    className={({ selected, active }) =>
                                      classNames(
                                        "flex cursor-default select-none items-center rounded-md p-2",
                                        selected
                                          ? "bg-gray-800 text-white"
                                          : "",
                                        active ? "bg-gray-800" : ""
                                      )
                                    }
                                  >
                                    {({ selected }) => (
                                      <>
                                        <img
                                          src={asset?.logo}
                                          alt=""
                                          className="h-6 w-6 flex-none rounded-full"
                                        />
                                        <span className="ml-3 flex-auto truncate">
                                          <div className="inline">
                                            {asset?.ticker}
                                          </div>
                                          {/* TODO: Pull token balances from user wallet */}
                                          <div className="float-right inline">
                                            1,234.5678910
                                          </div>
                                        </span>
                                        {selected && (
                                          <ChevronRightIcon
                                            className="ml-3 h-5 w-5 flex-none text-gray-300"
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

                        {selectedAsset && (
                          <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-500 divide-opacity-20 overflow-y-auto sm:flex">
                            <div className="flex-none p-6 text-center">
                              <img
                                src={selectedAsset.logo}
                                alt=""
                                className="mx-auto h-16 w-16 rounded-full"
                              />
                              <h2 className="mt-3 font-semibold text-gray-300">
                                {selectedAsset.name}
                              </h2>
                              <p className="text-sm leading-6 text-gray-500">
                                {selectedAsset.ticker}{" "}
                                {shortenString(selectedAsset.address)}
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
                                  URL
                                </dt>
                                <dd className="truncate">
                                  <a
                                    href={selectedAsset.site}
                                    className="text-indigo-600 underline"
                                  >
                                    {selectedAsset.site}
                                  </a>
                                </dd>
                              </dl>
                              <button
                                type="button"
                                className="mt-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpen(false)}
                              >
                                Select / Close
                              </button>
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
                          No assets found
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
