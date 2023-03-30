import { useEffect } from "react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import {
  classNames,
  convertFromWei,
  convertToWei,
  formatFromWei,
  shortenString,
} from "../utils/helpers/formatting";
import { useAccount, useBalance, useProvider } from "wagmi";
import { useAtom } from "jotai";
import { SwapSidePanel } from "../components/swap/swapSidePanel";
import { allSwapAtoms as atoms } from "../state/atoms";
import { address0 } from "../utils/const/addresses";
import { useAppDispatch } from "../utils/hooks";
import {
  changeCgAssetPrice,
  getSourceOutputs,
  resetSwapOutputs,
  updateSwapAsset1,
  updateSwapAsset2,
  updateSwapInput,
  useSwap,
} from "../state/swapStore";
import { CoinGeckoLogoTemp } from "../img/tempLogos";
import PageWrap from "../components/layout/pageWrap";
import SwapRatesTable from "../components/swap/swapRatesTable";
import AssetSelectButton from "../components/swap/assetSelectButton";
import TxnModal from "../components/transaction/txnModal";
import AssetSelect from "../components/assetSelect";
import PageHeading from "../components/pageHeading";

import type { NextPage } from "next";
import { returnUsdValAsset } from "../utils/helpers/valueReturns";

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();
  const {
    asset1,
    asset2,
    sourcesLoading,
    selectedSource,
    cgPriceAsset1,
    cgPriceAsset2,
    inputUnits,
  } = useSwap();
  const dispatch = useAppDispatch();
  const provider = useProvider({ chainId: 56 }); // TODO: use whatever chainid/network has been selected in the UI

  // Global States
  const [, setWalletOpen] = useAtom(atoms.walletOpenAtom);
  const [swapTxnOpen] = useAtom(atoms.swapTxnOpenAtom);
  const [assetSelectOpen, setassetSelectOpen] = useAtom(
    atoms.assetSelectOpenAtom
  );
  const [, setAssetId] = useAtom(atoms.assetIdAtom);

  const assetBalance1 = useBalance({
    address: address,
    token: asset1.address !== address0 ? asset1.address : undefined,
  });
  const assetBalance2 = useBalance({
    address: address,
    token: asset2.address !== address0 ? asset2.address : undefined,
  });

  const toggleAssetSelectOpen = (assetId: number) => {
    setAssetId(assetId);
    setassetSelectOpen(true);
  };

  const toggleFlipSelectedAssets = () => {
    const _prevAsset1 = asset1;
    dispatch(resetSwapOutputs());
    dispatch(updateSwapAsset1(asset2));
    dispatch(updateSwapAsset2(_prevAsset1));
  };

  const setInput = (units: string) => {
    const el = document.getElementById("inputUnits1") as HTMLInputElement;
    if (el) {
      dispatch(updateSwapInput(units));
      el.value = units;
      el.focus();
    }
  };

  /** Get the coingecko rates every X seconds or on dep changes */
  useEffect(() => {
    const intervalDelay = 15000; // Fallback to refresh rates every X secs if no deps change
    const checkRates = () => {
      dispatch(changeCgAssetPrice());
    };
    const interval = setInterval(() => checkRates(), intervalDelay);
    checkRates(); // On load
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, asset1.address, asset2.address]);

  return (
    <>
      {swapTxnOpen && <TxnModal />}
      {assetSelectOpen && <AssetSelect />}
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
                    onClick={() => setWalletOpen((prev) => !prev)}
                  >
                    Connect Wallet
                  </span>
                )}
              </div>
              <AssetSelectButton
                handleToggleOpen={toggleAssetSelectOpen}
                assetNumber={1}
                assetLogo={asset1.logo}
                assetTicker={asset1.ticker}
              />
              <div className="w-max justify-self-end py-2">
                <input
                  placeholder="0"
                  className="text-right"
                  id="inputUnits1"
                  onChange={(e) => dispatch(updateSwapInput(e.target.value))}
                />
                <XCircleIcon
                  className="ml-1 mb-1 inline h-5 w-5 text-gray-700"
                  aria-hidden="true"
                  role="button"
                  onClick={() => setInput("")}
                />
              </div>
              <div className="w-max">
                {shortenString(asset1.address)}
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
                ~$
                {returnUsdValAsset(convertToWei(inputUnits), cgPriceAsset1)}
                <div className="ml-1 inline-block h-4 w-4 align-middle">
                  <CoinGeckoLogoTemp />
                </div>
              </div>
            </div>
            <div className="w-100 text-center">
              <ArrowsUpDownIcon
                className="inline h-5 w-5 text-gray-700"
                aria-hidden="true"
                role="button"
                onClick={() => toggleFlipSelectedAssets()}
              />
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
                    onClick={() => setWalletOpen((prev) => !prev)}
                  >
                    Connect Wallet
                  </span>
                )}
              </div>
              <AssetSelectButton
                handleToggleOpen={toggleAssetSelectOpen}
                assetNumber={2}
                assetLogo={asset2.logo}
                assetTicker={asset2.ticker}
              />
              <div className="w-max justify-self-end py-2">
                <input
                  placeholder="Sell Units"
                  className="text-right"
                  id="inputUnits2"
                  value={convertFromWei(selectedSource.outputWei)}
                  disabled
                />
                <ArrowPathIcon
                  className={classNames(
                    "ml-1 mb-1 inline h-5 w-5 text-gray-700",
                    sourcesLoading ? "animate-spin" : ""
                  )}
                  aria-hidden="true"
                  role="button"
                  onClick={() => dispatch(getSourceOutputs(provider))}
                />
              </div>
              <div className="w-max">
                {shortenString(asset2.address)}
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
                ~$
                {returnUsdValAsset(selectedSource.outputWei, cgPriceAsset2)}
                <div className="ml-1 inline-block h-4 w-4 align-middle">
                  <CoinGeckoLogoTemp />
                </div>
              </div>
            </div>
            <div className="w-full border-t border-gray-300" />
            <div id="swapInfoSection" className="p-3">
              <div className="text-md font-medium">
                <SwapRatesTable />
              </div>
            </div>
          </div>

          <SwapSidePanel />
        </ul>
      </PageWrap>
    </>
  );
};

export default Swap;
