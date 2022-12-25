import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import AssetSelect, { bnbAsset, spartaAsset } from "../components/assetSelect";
import PageHeading from "../components/pageHeading";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import {
  BN,
  classNames,
  convertFromWei,
  convertToWei,
  formatFromWei,
  shortenString,
} from "../utils/formatting";
import { useAccount, useBalance } from "wagmi";
import PageWrap from "../components/layout/pageWrap";
import { SwapSidePanel } from "../components/swap/swapSidePanel";

import type { AssetProps } from "../components/assetSelect";
import { gasDefault } from "../utils/const";
export type AssetIdProps = 1 | 2;

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();

  const [assetSelectOpen, setassetSelectOpen] = useState<boolean>(false);
  const [assetId, setassetId] = useState<AssetIdProps>(1);
  const [selectedAsset1, setSelectedAsset1] = useState<AssetProps>(bnbAsset);
  const [selectedAsset2, setSelectedAsset2] = useState<AssetProps>(spartaAsset);
  const [isLoading, setLoading] = useState(false);
  const [inputAmount, setInputAmount] = useState("0");
  const [outputAmount, setOutputAmount] = useState("0.00");

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

  const onInputChange = useCallback(
    (inputValue: string) => {
      const weiInput = convertToWei(inputValue);
      if (BN(weiInput).isGreaterThan(0)) {
        const queryUrl =
          "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
          selectedAsset1.address +
          "&toTokenAddress=" +
          selectedAsset2.address +
          "&amount=" +
          weiInput +
          "&gasPrice=" +
          gasDefault;
        setLoading(true);
        fetch(queryUrl)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setOutputAmount(convertFromWei(data.toTokenAmount));
            setLoading(false);
          });
      } else {
        setInputAmount("");
        setOutputAmount("0.00");
      }
    },
    [selectedAsset1.address, selectedAsset2.address]
  );

  const setInput = useCallback((units: string) => {
    const el = document.getElementById("inputUnits1") as HTMLInputElement;
    if (el) {
      setInputAmount(units);
      el.value = units;
      el.focus();
    }
  }, []);

  /** Get new rate/quote every x seconds with a debounce delay to reduce API calls
   * Clear & re-calc whenever the inputAmount or selectedAssets change
   */
  useEffect(() => {
    const debounceDelay = 500;
    const intervalDelay = 10000;
    const timeOutId = setTimeout(
      () => onInputChange(inputAmount),
      debounceDelay
    );
    const interval = setInterval(
      () => onInputChange(inputAmount),
      intervalDelay
    );
    return () => {
      clearTimeout(timeOutId);
      clearInterval(interval);
    };
  }, [inputAmount, onInputChange, selectedAsset1, selectedAsset2]);

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
                <div className="w-max">Sell:</div>
                <div className="w-max justify-self-end">
                  {address ? (
                    <>
                      Balance:{" "}
                      {assetBalance1.data
                        ? formatFromWei(assetBalance1.data.value.toString())
                        : "0.00"}
                      <span
                        className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                        role="button"
                        onClick={() =>
                          assetBalance1.data &&
                          setInput(
                            convertFromWei(assetBalance1.data.value.toString())
                          )
                        }
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
                  className="w-max py-2"
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
                <div className="w-max justify-self-end py-2">
                  <input
                    placeholder="Buy Units"
                    className="text-right"
                    id="inputUnits1"
                    onChange={(e) => setInputAmount(e.target.value)}
                  />
                  <XCircleIcon
                    className="ml-1 mb-1 inline h-5 w-5 text-gray-700"
                    aria-hidden="true"
                    role="button"
                    onClick={() => setInput("")}
                  />
                </div>
                <div className="w-max">
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
                <div className="w-max justify-self-end">Rate: ??</div>
              </div>
              <div id="assetSection2" className="grid grid-cols-2 p-3">
                <div className="w-max">Buy:</div>
                <div className="w-max justify-self-end">
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
                  className="w-max py-2"
                >
                  <span>
                    <img
                      src={selectedAsset2.logo}
                      alt=""
                      className="inline h-6 w-6 flex-none rounded-full"
                      role="button"
                      onClick={() => setInput("")}
                    />
                    <div className="ml-2 inline">{selectedAsset2.ticker}</div>
                  </span>
                </div>
                <div className="w-max justify-self-end py-2">
                  <input
                    placeholder="Sell Units"
                    className="text-right"
                    id="inputUnits2"
                    value={outputAmount}
                    disabled
                  />
                  <ArrowPathIcon
                    className={classNames(
                      "ml-1 inline h-5 w-5 text-gray-700",
                      isLoading ? "animate-spin" : ""
                    )}
                    aria-hidden="true"
                    role="button"
                    onClick={() => onInputChange(inputAmount)}
                  />
                </div>
                <div className="w-max">
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
                <div className="w-max justify-self-end">Rate: ??</div>
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
