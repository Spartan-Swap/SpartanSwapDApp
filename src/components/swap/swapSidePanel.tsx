import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { classNames } from "../../utils/formatting";

const tabs: string[] = ["Route Info", "Price Chart"];

export function SwapSidePanel() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const toggleSelectedTab = (newTab: string) => {
    setSelectedTab(tabs.find((tab) => tab === newTab));
  };

  return (
    <div id="swapInfoSection" className="p-3">
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
      {selectedTab === tabs[0] && <div>Route Info Component</div>}
      {selectedTab === tabs[1] && <div>Price Chart Component</div>}
    </div>
  );
}
