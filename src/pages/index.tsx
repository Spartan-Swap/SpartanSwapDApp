import type { NextPage } from "next";
import { useState, useEffect } from "react";
import AssetSelect, { bnbAsset, spartaAsset } from "../components/assetSelect";
import PageHeading from "../components/pageHeading";

import type { AssetProps } from "../components/assetSelect";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/20/solid";
import { formatFromWei, shortenString } from "../utils/formatting";
import { useAccount, useBalance } from "wagmi";
export type AssetIdProps = 1 | 2;

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();

  const [assetSelectOpen, setassetSelectOpen] = useState<boolean>(false);
  const [assetId, setassetId] = useState<AssetIdProps>(1);
  const [selectedAsset1, setSelectedAsset1] = useState<AssetProps>(bnbAsset);
  const [selectedAsset2, setSelectedAsset2] = useState<AssetProps>(spartaAsset);
  // const [assetBalance1, setAssetBalance1] = useState("0");
  // const [assetBalance2, setAssetBalance2] = useState("0");

  const assetBalance1 = useBalance({
    address: address,
    token: selectedAsset1.address,
  });
  const assetBalance2 = useBalance({
    address: address,
    token: selectedAsset2.address,
  });

  // useEffect(() => {
  //   console.log("TODO: Update asset1 balance state");
  // }, [selectedAsset1]);

  // useEffect(() => {
  //   console.log("TODO: Update asset1 balance state");
  // }, [selectedAsset2]);

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
      <main className="container mx-auto flex flex-row flex-wrap space-x-1 p-4 sm:px-6 lg:px-8">
        <div id="first" className="">
          <div className="h-full overflow-hidden rounded-lg bg-white shadow">
            <div id="assetSection1" className="grid grid-cols-2 p-3">
              <div>Sell:</div>
              <div className="justify-self-end">
                Balance:{" "}
                {assetBalance1.data
                  ? formatFromWei(assetBalance1.data.value.toString())
                  : "0.00"}
                <span className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  MAX
                </span>
              </div>
              <div onClick={() => toggleAssetSelectOpen(1)}>
                <span>
                  <img
                    src={selectedAsset1.logo}
                    alt=""
                    className="inline h-6 w-6 flex-none rounded-full"
                  />
                  <div className="ml-2 inline">{selectedAsset1.ticker}</div>
                </span>
              </div>
              <div className="justify-self-end">
                <input
                  placeholder="Input Units Formbox"
                  className="text-right"
                />
              </div>
              <div>
                {shortenString(selectedAsset1.address)}
                <span>
                  <DocumentDuplicateIcon
                    className="ml-1 inline h-4 w-4 text-gray-700"
                    aria-hidden="true"
                    // onClick={() => TODO: Copy the address to clipboard }
                  />
                  <ArrowTopRightOnSquareIcon
                    className="ml-1 inline h-4 w-4 text-gray-700"
                    aria-hidden="true"
                    // onClick={() => TODO: Open wallet in explorer }
                  />
                </span>
              </div>
              <div className="justify-self-end">Rate: ??</div>
            </div>
            <div id="assetSection2" className="grid grid-cols-2 p-3">
              <div>Buy:</div>
              <div className="justify-self-end">
                Balance:{" "}
                {assetBalance2.data
                  ? formatFromWei(assetBalance2.data.value.toString())
                  : "0.00"}
                <span className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  MAX
                </span>
              </div>
              <div onClick={() => toggleAssetSelectOpen(2)}>
                <span>
                  <img
                    src={selectedAsset2.logo}
                    alt=""
                    className="inline h-6 w-6 flex-none rounded-full"
                  />
                  <div className="ml-2 inline">{selectedAsset2.ticker}</div>
                </span>
              </div>
              <div className="justify-self-end">
                <input
                  placeholder="Input Units Formbox"
                  className="text-right"
                />
              </div>
              <div>
                {" "}
                {shortenString(selectedAsset2.address)}
                <span>
                  <DocumentDuplicateIcon
                    className="ml-1 inline h-4 w-4 text-gray-700"
                    aria-hidden="true"
                    // onClick={() => TODO: Copy the address to clipboard }
                  />
                  <ArrowTopRightOnSquareIcon
                    className="ml-1 inline h-4 w-4 text-gray-700"
                    aria-hidden="true"
                    // onClick={() => TODO: Open wallet in explorer }
                  />
                </span>
              </div>
              <div className="justify-self-end">Rate: ??</div>
            </div>
            <div id="swapInfoSection" className="p-3">
              <span>Rate</span>
              <span className="float-right">Fees</span>
              <div>PCS Comparison Rate</div>
              <div>Simple Route Info</div>
            </div>
          </div>
        </div>
        <div id="second" className="">
          <div className="h-full overflow-hidden rounded-lg bg-white shadow">
            <div id="swapInfoSection" className="p-3">
              <span>Tab1</span>
              <span className="float-right">Tab2</span>
              <div>Price Chart Component (Tab1)</div>
              <div>Route Info Component (Tab2)</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Swap;
