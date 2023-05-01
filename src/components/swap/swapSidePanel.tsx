import { useState } from "react";
import { useAtom } from "jotai";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";

import {
  BN,
  classNames,
  convertFromGwei,
  formatFromGwei,
  formatFromWei,
} from "../../utils/helpers/formatting";
import { allSwapSidePanelAtoms as atoms } from "../../state/atoms";

import { gasDefault } from "../../utils/const/general";
import { useSwap } from "../../state/swapStore";
import { useAccount } from "wagmi";

const tabs: string[] = ["Swap Details", "Price Chart"];

export function SwapSidePanel() {
  const { isConnected } = useAccount();
  const { asset1, asset2, selectedSource, inputUnits } = useSwap();

  const [, setSwapTxnOpen] = useAtom(atoms.swapTxnOpenAtom);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const toggleSelectedTab = (newTab: string) => {
    setSelectedTab(tabs.find((tab) => tab === newTab));
  };

  return (
    <div
      id="swapInfoSection"
      className="h-100 rounded-md p-3"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)),url('${selectedSource.imagesq}')`,
        backgroundSize: "700px",
        backgroundPosition: "left",
      }}
    >
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={selectedTab}
            onChange={(tab) => toggleSelectedTab(tab.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab}>{tab}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="space-x-auto flex w-full pb-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={classNames(
                  tab === selectedTab
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700",
                  "rounded-md px-3 py-1 text-xs font-medium"
                )}
                aria-current={tab === selectedTab ? "page" : undefined}
                role="button"
                onClick={() => toggleSelectedTab(tab)}
              >
                {tab}
              </div>
            ))}
            <div className="ml-auto">
              <AdjustmentsHorizontalIcon
                className="h-5 text-gray-700"
                aria-hidden="true"
                role="button"
                // onClick={() => TODO: Open settings }
              />
            </div>
          </nav>
        </div>
      </div>
      {selectedTab === tabs[0] && (
        <div className="py-2">
          <div className="">
            The selected swap provider is {selectedSource.name}
          </div>
          <div className="py-2" />
          <div className="">
            Your {inputUnits} {asset1.ticker} will route via these pools:
          </div>
          <div className="">*Route Chart*</div>
          <div className="py-2" />
          <div className="">
            Estimated receiving:{" "}
            {formatFromWei(selectedSource.outputWei ?? "0")} {asset2.ticker}
          </div>
          <div className="">
            Estimated gas cost: ~
            {selectedSource.gasEstGwei !== ""
              ? formatFromGwei(
                  BN(selectedSource.gasEstGwei)
                    .times(convertFromGwei(gasDefault))
                    .toString()
                )
              : "Unknown"}{" "}
            BNB
          </div>
          <div className="py-2" />
          <div>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              // TODO: Add disabled style state
              onClick={() => setSwapTxnOpen(true)}
              disabled={
                BN(selectedSource.outputWei).isLessThanOrEqualTo(0) ||
                !isConnected
              }
            >
              Swap
            </button>
          </div>
        </div>
      )}
      {selectedTab === tabs[1] && <div>Price Chart Component</div>}
    </div>
  );
}
