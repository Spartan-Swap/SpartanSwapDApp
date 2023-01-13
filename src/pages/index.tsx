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

import { gasDefault } from "../utils/const";
import WalletModal from "../components/wallet/walletModal";
import SwapRatesTable from "../components/swap/swapRatesTable";
import { CoinGeckoLogoTemp, swapSources } from "../utils/swapSources";

import type { AssetProps } from "../components/assetSelect";
import type { SwapSourceProps } from "../utils/swapSources";
import Image from "next/image";
import AssetSelectButton from "../components/swap/assetSelectButton";
export type AssetIdProps = 1 | 2;

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();

  const [walletOpen, setWalletOpen] = useState(false);
  const [assetSelectOpen, setassetSelectOpen] = useState<boolean>(false);
  const [assetId, setassetId] = useState<AssetIdProps>(1);
  const [selectedAsset1, setSelectedAsset1] = useState<AssetProps>(bnbAsset);
  const [selectedAsset2, setSelectedAsset2] = useState<AssetProps>(spartaAsset);
  const [allSources, setAllSources] = useState<SwapSourceProps[]>(swapSources);
  const [selectedSource, setSelectedSource] = useState<string>("");
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

  const toggleWallet = () => {
    setWalletOpen(!walletOpen);
  };

  const toggleAssetSelectOpen = (assetId: AssetIdProps) => {
    setassetId(assetId);
    setassetSelectOpen(true);
  };

  useEffect(() => {
    const _item = allSources.find((x) => x.id === selectedSource);
    if (_item) {
      setOutputAmount(_item.outputAmount);
    }
  }, [selectedSource, allSources]);

  const changeSourceValue = useCallback(
    (id: string, propName: string, newValue: string) => {
      setAllSources((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [propName]: newValue } : item
        )
      );
    },
    []
  );

  const get1InchData = useCallback(
    (weiInput: string) => {
      const queryUrl =
        "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
        selectedAsset1.address +
        "&toTokenAddress=" +
        selectedAsset2.address +
        "&amount=" +
        weiInput +
        "&gasPrice=" +
        gasDefault;
      fetch(queryUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            changeSourceValue("1INCH", "outputAmount", "0");
            changeSourceValue("1INCH", "error", data.error);
          } else {
            changeSourceValue("1INCH", "outputAmount", data.toTokenAmount);
            changeSourceValue("1INCH", "error", "");
          }
        });
    },
    [changeSourceValue, selectedAsset1.address, selectedAsset2.address]
  );

  const onInputChange = useCallback(
    async (inputValue: string) => {
      const weiInput = convertToWei(inputValue);
      if (BN(weiInput).isGreaterThan(0)) {
        // If chainId === 56 (BSC)
        get1InchData(weiInput);
        // If chainId === eth
        // If chainId === etc.etc.etc
        setLoading(false);
      } else {
        setInputAmount("");
        setAllSources(swapSources);
      }
    },
    [get1InchData]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAmount, selectedAsset1, selectedAsset2]);

  return (
    <>
      <WalletModal isOpen={walletOpen} setOpen={setWalletOpen} />
      <AssetSelect
        selectedAsset={assetId === 1 ? selectedAsset1 : selectedAsset2}
        setSelectedAsset={assetId === 1 ? setSelectedAsset1 : setSelectedAsset2}
        isOpen={assetSelectOpen}
        setOpen={setassetSelectOpen}
      />
      <PageHeading title="Swap" button1={button1} button2={button2} />
      <PageWrap>
        <ul className="grid grid-cols-1 divide-y divide-gray-200 rounded-lg bg-white shadow md:grid-cols-2 md:divide-y-0 md:divide-x">
          <div className="">
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
                  <span
                    className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                    role="button"
                    onClick={() => toggleWallet()}
                  >
                    Connect Wallet
                  </span>
                )}
              </div>
              <AssetSelectButton
                handleToggleOpen={toggleAssetSelectOpen}
                assetNumber={1}
                assetLogo={selectedAsset1.logo}
                assetTicker={selectedAsset1.ticker}
              />
              <div className="w-max justify-self-end py-2">
                <input
                  placeholder="0"
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
              <div className="w-max justify-self-end">
                ~$0.00{" "}
                <div className="inline-block h-4 w-4 align-middle">
                  <CoinGeckoLogoTemp />
                </div>
              </div>
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
                  <span
                    className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                    role="button"
                    onClick={() => toggleWallet()}
                  >
                    Connect Wallet
                  </span>
                )}
              </div>
              <AssetSelectButton
                handleToggleOpen={toggleAssetSelectOpen}
                assetNumber={2}
                assetLogo={selectedAsset2.logo}
                assetTicker={selectedAsset2.ticker}
              />
              <div className="w-max justify-self-end py-2">
                <input
                  placeholder="Sell Units"
                  className="text-right"
                  id="inputUnits2"
                  value={convertFromWei(outputAmount)}
                  disabled
                />
                <ArrowPathIcon
                  className={classNames(
                    "ml-1 mb-1 inline h-5 w-5 text-gray-700",
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
              <div className="w-max justify-self-end">
                ~$0.00{" "}
                <div className="inline-block h-4 w-4 align-middle">
                  <CoinGeckoLogoTemp />
                </div>
              </div>
            </div>
            <div className="w-full border-t border-gray-300" />
            <div id="swapInfoSection" className="p-3">
              <div className="text-md font-medium">
                <SwapRatesTable
                  sources={allSources}
                  setSelectedSource={setSelectedSource}
                  selectedSource={selectedSource}
                  selectedAsset2={selectedAsset2}
                />
              </div>
            </div>
          </div>

          <SwapSidePanel
            selectedSource={selectedSource}
            selectedAsset1={selectedAsset1}
            selectedAsset2={selectedAsset2}
            inputAmount={inputAmount}
          />
        </ul>
      </PageWrap>
    </>
  );
};

export default Swap;
