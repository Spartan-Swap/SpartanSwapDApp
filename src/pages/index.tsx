import type { NextPage } from "next";
import { useState } from "react";
import AssetSelect, { bnbAsset, spartaAsset } from "../components/assetSelect";
import PageHeading from "../components/pageHeading";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { formatFromWei, shortenString } from "../utils/formatting";
import { useAccount, useBalance } from "wagmi";
import PageWrap from "../components/layout/pageWrap";
import { SwapSidePanel } from "../components/swap/swapSidePanel";

import type { AssetProps } from "../components/assetSelect";
export type AssetIdProps = 1 | 2;

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();

  const [assetSelectOpen, setassetSelectOpen] = useState<boolean>(false);
  const [assetId, setassetId] = useState<AssetIdProps>(1);
  const [selectedAsset1, setSelectedAsset1] = useState<AssetProps>(bnbAsset);
  const [selectedAsset2, setSelectedAsset2] = useState<AssetProps>(spartaAsset);

  const assetBalance1 = useBalance({
    address: address,
    token: selectedAsset1.address,
  });
  const assetBalance2 = useBalance({
    address: address,
    token: selectedAsset2.address,
  });

  const toggleAssetSelectOpen = (assetId: AssetIdProps) => {
    setassetId(assetId);
    setassetSelectOpen(true);
  };

  return (
    <>
      <AssetSelect
        selectedAsset={assetId === 1 ? selectedAsset1 : selectedAsset2}
        setSelectedAsset={assetId === 1 ? setSelectedAsset1 : setSelectedAsset2}
        isOpen={assetSelectOpen}
        setOpen={setassetSelectOpen}
      />
      <PageHeading title="Swap" button1={button1} button2={button2} />
      <PageWrap>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <li id="first" className="col-span-1 divide-y divide-gray-200">
            <div className="mx-auto h-full overflow-hidden rounded-lg bg-white shadow">
              <div id="assetSection1" className="grid grid-cols-2 p-3">
                <div>Sell:</div>
                <div className="justify-self-end">
                  {address ? (
                    <>
                      Balance:{" "}
                      {assetBalance1.data
                        ? formatFromWei(assetBalance1.data.value.toString())
                        : "0.00"}
                      <span
                        className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                        role="button"
                        // onClick={() => TODO: Update input1 to max balance available }
                      >
                        MAX
                      </span>
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </div>
                <div
                  onClick={() => toggleAssetSelectOpen(1)}
                  role="button"
                  className="py-2"
                >
                  <span>
                    <img
                      src={selectedAsset1.logo}
                      alt=""
                      className="inline h-6 w-6 flex-none rounded-full"
                    />
                    <div className="ml-2 inline">{selectedAsset1.ticker}</div>
                  </span>
                </div>
                <div className="justify-self-end py-2">
                  <input
                    placeholder="Buy Units"
                    className="text-right"
                    id="inputUnits1"
                  />
                  <XCircleIcon
                    className="ml-1 mb-1 inline h-5 w-5 text-gray-700"
                    aria-hidden="true"
                    role="button"
                    // onClick={() => TODO: Clear input1 }
                  />
                </div>
                <div>
                  {shortenString(selectedAsset1.address)}
                  <span>
                    <DocumentDuplicateIcon
                      className="ml-1 inline h-4 w-4 text-gray-700"
                      aria-hidden="true"
                      role="button"
                      // onClick={() => TODO: Copy the address to clipboard }
                    />
                    <ArrowTopRightOnSquareIcon
                      className="ml-1 inline h-4 w-4 text-gray-700"
                      aria-hidden="true"
                      role="button"
                      // onClick={() => TODO: Open wallet in explorer }
                    />
                  </span>
                </div>
                <div className="justify-self-end">Rate: ??</div>
              </div>
              <div id="assetSection2" className="grid grid-cols-2 p-3">
                <div>Buy:</div>
                <div className="justify-self-end">
                  {address ? (
                    <>
                      Balance:{" "}
                      {assetBalance2.data
                        ? formatFromWei(assetBalance2.data.value.toString())
                        : "0.00"}
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </div>
                <div
                  onClick={() => toggleAssetSelectOpen(2)}
                  role="button"
                  className="py-2"
                >
                  <span>
                    <img
                      src={selectedAsset2.logo}
                      alt=""
                      className="inline h-6 w-6 flex-none rounded-full"
                    />
                    <div className="ml-2 inline">{selectedAsset2.ticker}</div>
                  </span>
                </div>
                <div className="justify-self-end py-2">
                  <input
                    placeholder="Sell Units"
                    className="text-right"
                    id="inputUnits2"
                    disabled
                  />
                </div>
                <div>
                  {" "}
                  {shortenString(selectedAsset2.address)}
                  <span>
                    <DocumentDuplicateIcon
                      className="ml-1 inline h-4 w-4 text-gray-700"
                      aria-hidden="true"
                      role="button"
                      // onClick={() => TODO: Copy the address to clipboard }
                    />
                    <ArrowTopRightOnSquareIcon
                      className="ml-1 inline h-4 w-4 text-gray-700"
                      aria-hidden="true"
                      role="button"
                      // onClick={() => TODO: Open wallet in explorer }
                    />
                  </span>
                </div>
                <div className="justify-self-end">Rate: ??</div>
              </div>
              <div className="w-full border-t border-gray-300" />
              <div id="swapInfoSection" className="p-3">
                <span>Rate</span>
                <span className="float-right">Fees</span>
                <div>PCS Comparison Rate</div>
                <div>Simple Route Info</div>
              </div>
            </div>
          </li>
          <li id="second" className="col-span-1 divide-y divide-gray-200">
            <div className="mx-auto h-full overflow-hidden rounded-lg bg-white shadow">
              <SwapSidePanel />
            </div>
          </li>
        </ul>
      </PageWrap>
    </>
  );
};

export default Swap;
