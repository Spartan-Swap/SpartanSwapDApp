import { CheckIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useAccount, useSigner } from "wagmi";
import { useSwap } from "../../state/swapStore";
import {
  getSwapSourceApproval,
  getSwapSourceSwapTxn,
} from "../../utils/const/swapSources/swapSources";
import {
  BN,
  classNames,
  convertToWei,
  formatFromWei,
} from "../../utils/helpers/formatting";
import { ethers } from "ethers";

import { allSwapTxnModalAtoms as atoms } from "../../state/atoms";

export default function TxnProgress() {
  const { address } = useAccount();
  const {
    swapStep1,
    swapStep2,
    swapStep3,
    selectedSource,
    asset1,
    asset2,
    inputUnits,
  } = useSwap();
  const { data: signer, isError, isLoading } = useSigner({ chainId: 56 }); // TODO: use whatever chainid/network has been selected in the UI

  const [, setSwapTxnOpen] = useAtom(atoms.swapTxnOpenAtom);

  const [minPC, setminPC] = useState("0.5");
  const [minAmountWei, setminAmountWei] = useState("");
  const [minAmountLocked, setminAmountLocked] = useState(false);

  useEffect(() => {
    if (!minAmountLocked) {
      setminAmountWei(
        BN(selectedSource.outputWei)
          .times(BN("1").minus(BN(minPC).div("100")))
          .toString()
      );
    }
  }, [minAmountLocked, minPC, selectedSource.outputWei]);

  return (
    <>
      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {[swapStep1, swapStep2, swapStep3].map((step, stepIdx) => (
            <li
              key={step.name}
              className={classNames(stepIdx !== 2 ? "pb-10" : "", "relative")}
            >
              {step.status === "complete" ? (
                // TODO: Add button to revoke allowance for stepIdx === 1
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
                        {/* TODO: Add ext link icon button here to check allowance target addr in explorer
                        {stepIdx === 1 && "BUTTON"} */}
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
                                  // TODO: Fix width on mobile
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
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-600 bg-gray-300 px-3 text-center text-gray-600 sm:text-sm">
                              Min Received:
                            </span>
                            <input
                              type="text"
                              className="block w-full rounded-none border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={
                                formatFromWei(minAmountWei) +
                                " " +
                                asset2.ticker
                              }
                              disabled
                            />
                          </div>
                          <button
                            type="button"
                            // TODO: Fix styles here
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setminAmountLocked((prev) => !prev)}
                          >
                            {minAmountLocked ? "Unlock" : "Lock"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 text-white">
                          <span>
                            <button
                              type="button"
                              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                              // disabled={}
                              onClick={() => {
                                stepIdx === 0 && signer
                                  ? getSwapSourceApproval(selectedSource.id, [
                                      asset1,
                                      ethers.constants.MaxUint256.toString(),
                                      signer,
                                      selectedSource.allowanceTarget,
                                    ])
                                  : stepIdx === 2
                                  ? console.log("TODO: Swap Txn")
                                  : console.log(
                                      "Incorrect step ID or no signer available"
                                    );
                              }}
                            >
                              {stepIdx === 0 && "Approve Max"}
                              {stepIdx === 2 && "Perform Swap"}
                            </button>
                            {stepIdx === 0 && signer && (
                              <button
                                type="button"
                                className="ml-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                // disabled={}
                                onClick={() => {
                                  getSwapSourceApproval(selectedSource.id, [
                                    asset1,
                                    convertToWei(inputUnits),
                                    signer,
                                    selectedSource.allowanceTarget,
                                  ]);
                                }}
                              >
                                Approve Exact
                              </button>
                            )}
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
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        {minAmountLocked && signer && (
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            // disabled={}
            onClick={() =>
              getSwapSourceSwapTxn(selectedSource.id, [
                asset1,
                asset2,
                convertToWei(inputUnits),
                BN(minAmountWei).toFixed(0),
                signer,
                address ?? "",
                minPC, // Slippage PC in units. ie. 1 = 1% ... 0.5 = 0.5% ... etc
              ])
            }
          >
            Perform Swap
          </button>
        )}
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          onClick={() => setSwapTxnOpen(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
