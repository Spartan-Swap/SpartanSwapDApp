import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { classNames } from "../../utils/formatting";
import { swapSources, spartanProtocolSource } from "../../utils/swapSources";

import type { SwapSourceProps } from "../../utils/swapSources";
import type { AssetProps } from "../assetSelect";
import Image from "next/image";

const tabs: string[] = ["Swap Details", "Price Chart"];

type SwapSidePanelProps = {
  selectedSource: string;
  selectedAsset1: AssetProps;
  selectedAsset2: AssetProps;
  inputAmount: string;
};

export function SwapSidePanel({
  selectedSource,
  selectedAsset1,
  selectedAsset2,
  inputAmount,
}: SwapSidePanelProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [sourceInfo, setSourceInfo] = useState<SwapSourceProps>(
    spartanProtocolSource
  );

  const toggleSelectedTab = (newTab: string) => {
    setSelectedTab(tabs.find((tab) => tab === newTab));
  };

  useEffect(() => {
    const _source = swapSources.filter(
      (source) => source.id === selectedSource
    )[0];
    if (_source) {
      setSourceInfo(_source);
    } else {
      setSourceInfo(spartanProtocolSource);
    }
  }, [selectedSource]);

  return (
    <div
      id="swapInfoSection"
      className="h-100 p-3 rounded-md"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)),url('${sourceInfo.imagesq}')`,
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
            The selected swap provider is {sourceInfo.name}
          </div>
          <div className="py-2" />
          <div className="">
            Your {inputAmount} {selectedAsset1.ticker} will route via these
            pools:
          </div>
          <div className="">*Route Chart*</div>
          <div className="py-2" />
          <div className="">
            Estimated receiving: 00,000.00 {selectedAsset2.ticker}
          </div>
          <div className="">Estimated gas cost: ~0.00000 BNB</div>
        </div>
      )}
      {selectedTab === tabs[1] && <div>Price Chart Component</div>}
    </div>
  );
}
