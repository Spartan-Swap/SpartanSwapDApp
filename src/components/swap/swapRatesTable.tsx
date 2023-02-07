import { useAtom } from "jotai";

import SwapRatesTableItem from "./swapRatesTableItem";
import { allSwapRatesTableAtoms as atoms } from "../../state/globalStore";

export default function SwapRatesTable() {
  const [allSourcesSplit] = useAtom(atoms.allSourcesAtomSplit);

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {allSourcesSplit.map((swapSource) => (
                    <SwapRatesTableItem
                      swapSourceItem={swapSource}
                      key={swapSource.toString()}
                    />
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
