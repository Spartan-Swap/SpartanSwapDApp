import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { walletList } from "./client";
import { useConnect } from "wagmi";

import type { WalletProps } from "./client";

function classNames(...classes: string[]) {
  return classes.join(" ");
}

// TODO: Make this use-able on mobile (show inline 'connect' button on mobile but make sure active state is handled correctly)
export default function WalletSelect() {
  const { connect } = useConnect();

  const [query, setQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletProps | undefined>(
    walletList[0]
  );

  const filteredWallets = walletList.filter((wallet: WalletProps) => {
    return wallet.name.toLowerCase().includes(query.toLowerCase());
  });

  const connectWallet = () => {
    if (selectedWallet?.connector) {
      const _connector = selectedWallet.connector;
      connect({ chainId: 56, connector: _connector }); // TODO: Utilize a selected chain
    } else {
      console.log("Invalid connector/wallet");
    }
  };

  return (
    <>
      <Combobox
        value={selectedWallet}
        onChange={(wallet) => setSelectedWallet(wallet)}
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

            {(query === "" || filteredWallets.length > 0) && (
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
                  <div className="-mx-2 text-sm text-gray-500">
                    {filteredWallets.map((wallet) => (
                      <Combobox.Option
                        as="div"
                        key={wallet.id}
                        value={wallet}
                        className={({ active, selected }) =>
                          classNames(
                            "flex cursor-default select-none items-center rounded-md p-2",
                            selected ? "bg-gray-800 text-white" : "",
                            active ? "bg-gray-800" : ""
                          )
                        }
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        {({ selected }) => (
                          <>
                            <img
                              src={wallet.logo}
                              alt=""
                              className="h-6 w-6 flex-none rounded-full"
                            />
                            <span className="ml-3 flex-auto truncate">
                              {wallet.name}
                            </span>
                            {selected && (
                              <ChevronRightIcon
                                className="ml-3 hidden h-5 w-5 flex-none text-gray-300 sm:block"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                </div>

                {selectedWallet && (
                  <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-500 divide-opacity-20 overflow-y-auto sm:flex">
                    <div className="flex-none p-6 text-center">
                      <img
                        src={selectedWallet.logo}
                        alt=""
                        className="mx-auto h-16 w-16 rounded-full"
                      />
                      <h2 className="mt-3 font-semibold text-gray-300">
                        {selectedWallet.name}
                      </h2>
                      <p className="text-sm leading-6 text-gray-300">
                        {selectedWallet.desc}
                      </p>
                    </div>
                    <div className="flex flex-auto flex-col justify-between p-6">
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-300">
                        <dt className="col-end-1 font-semibold text-gray-400">
                          URL
                        </dt>
                        <dd className="truncate">
                          <a
                            href={selectedWallet.url}
                            className="text-indigo-600 underline"
                          >
                            {selectedWallet.url}
                          </a>
                        </dd>
                      </dl>
                      <button
                        type="button"
                        className="mt-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => connectWallet()}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                )}
              </Combobox.Options>
            )}

            {query !== "" && filteredWallets.length === 0 && (
              <div className="py-14 px-6 text-center text-sm sm:px-14">
                <UsersIcon
                  className="mx-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-gray-900">
                  No people found
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
