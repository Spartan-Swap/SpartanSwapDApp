import { Fragment, useState } from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { classNames, shortenString } from "../utils/helpers/formatting";
import { allAssetSelectAtoms as atoms } from "../state/atoms";
import {
  updateSwapAsset1,
  updateSwapAsset2,
  useSwap,
} from "../state/swapStore";
import { useAppDispatch } from "../utils/hooks";
import { assets, recentAssetsPlaceholder } from "../utils/const/assets";

import type { AssetProps } from "../utils/const/assets";

export default function AssetSelect() {
  const { asset1, asset2 } = useSwap();
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");

  const [assetSelectOpen, setAssetSelectOpen] = useAtom(
    atoms.assetSelectOpenAtom
  );
  const [assetId] = useAtom(atoms.assetIdAtom);

  const getSelectedAsset = () => {
    if (assetId === 1) {
      return asset1;
    } else {
      return asset2;
    }
  };

  const getSetSelectedAsset = (assetNumber: AssetProps) => {
    if (assetId === 1) {
      dispatch(updateSwapAsset1(assetNumber));
      return;
    } else {
      dispatch(updateSwapAsset2(assetNumber));
      return;
    }
  };

  const filteredAssets =
    query === ""
      ? []
      : assets.filter((asset: AssetProps) => {
          return asset.ticker.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root
      show={assetSelectOpen}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setAssetSelectOpen}>
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
                value={getSelectedAsset()}
                onChange={(asset) => getSetSelectedAsset(asset)}
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
                                recentAssetsPlaceholder.map(
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
                                        <div className="relative mx-auto h-6 w-6 flex-none rounded-full">
                                          <Image
                                            alt=""
                                            src={asset?.logo}
                                            fill
                                            className="object-contain"
                                          />
                                        </div>
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
                                        <div className="relative h-6 w-6 flex-none rounded-full">
                                          <Image
                                            alt=""
                                            src={asset?.logo}
                                            fill
                                            className="object-contain"
                                          />
                                        </div>
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

                        {getSelectedAsset() && (
                          <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-500 divide-opacity-20 overflow-y-auto sm:flex">
                            <div className="flex-none p-6 text-center">
                              <div className="relative mx-auto h-16 w-16 rounded-full">
                                <Image
                                  src={getSelectedAsset().logo}
                                  alt=""
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <h2 className="mt-3 font-semibold text-gray-300">
                                {getSelectedAsset().name}
                              </h2>
                              <p className="text-sm leading-6 text-gray-500">
                                {getSelectedAsset().ticker}{" "}
                                {shortenString(getSelectedAsset().address)}
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
                              <div className="text-sm text-gray-400">
                                {getSelectedAsset().ticker} is a{" "}
                                {getSelectedAsset().type} on the BNB Smartchain
                                network{" "}
                                {getSelectedAsset().peg !== "" &&
                                  "that is pegged to " +
                                    getSelectedAsset().peg +
                                    " asset price"}
                              </div>
                              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-400">
                                <dt className="col-end-1 font-semibold text-gray-300">
                                  URL
                                </dt>
                                <dd className="truncate">
                                  <a
                                    href={getSelectedAsset().site}
                                    className="text-indigo-600 underline"
                                  >
                                    {getSelectedAsset().site}
                                  </a>
                                </dd>
                              </dl>
                              <button
                                type="button"
                                className="mt-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setAssetSelectOpen(false)}
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
