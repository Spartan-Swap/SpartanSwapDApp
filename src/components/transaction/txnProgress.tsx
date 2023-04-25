import { CheckIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useSwap } from "../../state/swapStore";
import {
  BN,
  classNames,
  convertFromWei,
  formatFromWei,
} from "../../utils/helpers/formatting";

export default function TxnProgress() {
  const { swapStep1, swapStep2, swapStep3, selectedSource, asset2 } = useSwap();

  const [minPC, setminPC] = useState("0.5");

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {[swapStep1, swapStep2, swapStep3].map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(stepIdx !== 2 ? "pb-10" : "", "relative")}
          >
            {step.status === "complete" ? (
              <>
                {stepIdx !== 2 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col text-left">
                    <span className="text-sm font-medium text-indigo-600">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== 2 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div
                  className="group relative flex items-start"
                  aria-current="step"
                >
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col text-left">
                    <span className="text-sm font-medium text-white">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                    {stepIdx === 1 && (
                      <div className="mt-2 text-white">
                        <span>
                          <span className="isolate mr-2 inline-flex rounded-md shadow-sm">
                            <button
                              type="button"
                              className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                              onClick={() => setminPC("0.1")}
                            >
                              0.1%
                            </button>
                            <button
                              type="button"
                              className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                              onClick={() => setminPC("0.5")}
                            >
                              0.5%
                            </button>
                            <button
                              type="button"
                              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                              onClick={() => setminPC("1.0")}
                            >
                              1.0%
                            </button>
                            <div className="ml-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                className="rounded-none rounded-l-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder={minPC}
                                onChange={(e) => setminPC(e.target.value)}
                                value={minPC}
                              />
                              <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-3 text-gray-500 sm:text-sm">
                                %
                              </span>
                            </div>
                          </span>
                        </span>
                      </div>
                    )}
                    {stepIdx === 1 ? (
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <div className="relative flex flex-grow items-stretch focus-within:z-10">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-300 px-3 text-center text-gray-600 sm:text-sm">
                            Min Received:
                          </span>
                          <input
                            type="text"
                            className="block w-full rounded-none border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder={
                              formatFromWei(
                                BN(selectedSource.outputWei)
                                  .times(BN("1").minus(BN(minPC).div("100")))
                                  .toString()
                              ) +
                              " " +
                              asset2.ticker
                            }
                            disabled
                          />
                        </div>
                        <button
                          type="button"
                          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-white">
                        <span>
                          <button
                            type="button"
                            className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                            // disabled={}
                            onClick={() => console.log("TODO:")}
                          >
                            {stepIdx === 0 && "Approve"}
                            {stepIdx === 2 && "Perform Swap"}
                          </button>
                        </span>
                      </div>
                    )}
                  </span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== 2 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                      {/* <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" /> */}
                      <LockClosedIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col text-left">
                    <span className="text-sm font-medium text-gray-300">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
