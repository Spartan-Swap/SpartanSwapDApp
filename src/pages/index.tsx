import type { NextPage } from "next";
import AssetSelect from "../components/assetSelect";
import PageHeading from "../components/pageHeading";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import {
  convertFromWei,
  formatFromWei,
  shortenString,
} from "../utils/formatting";
import { useAccount, useBalance } from "wagmi";
import { useAtom } from "jotai";
import PageWrap from "../components/layout/pageWrap";
import { SwapSidePanel } from "../components/swap/swapSidePanel";

import SwapRatesTable from "../components/swap/swapRatesTable";
import { CoinGeckoLogoTemp } from "../utils/swapSources";
import AssetSelectButton from "../components/swap/assetSelectButton";
import TxnModal from "../components/transaction/txnModal";
import { allSwapAtoms as atoms } from "../state/globalStore";

export type AssetIdProps = 1 | 2;

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const { address } = useAccount();
  // const provider = useProvider({ chainId: 56 }); // TODO: use whatever chainid/network has been selected in the UI

  // --- GLOBAL STATE ---
  // Simple types
  const [, setWalletOpen] = useAtom(atoms.walletOpenAtom);
  const [swapTxnOpen] = useAtom(atoms.swapTxnOpenAtom);
  const [assetSelectOpen, setassetSelectOpen] = useAtom(
    atoms.assetSelectOpenAtom
  );
  const [, setAssetId] = useAtom(atoms.assetIdAtom);
  const [selectedSource] = useAtom(atoms.selectedSourceAtom);
  const [, setInputAmount] = useAtom(atoms.inputAmountAtom);
  // Objects - candidates for focusAtom(dataAtom, (optic) => optic.prop('people'))
  const [selectedAsset1] = useAtom(atoms.selectedAsset1Atom);
  const [selectedAsset2] = useAtom(atoms.selectedAsset2Atom);

  const assetBalance1 = useBalance({
    address: address,
    token: selectedAsset1.address,
  });
  const assetBalance2 = useBalance({
    address: address,
    token: selectedAsset2.address,
  });

  const toggleAssetSelectOpen = (assetId: AssetIdProps) => {
    setAssetId(assetId);
    setassetSelectOpen(true);
  };

  const setInput = (units: string) => {
    const el = document.getElementById("inputUnits1") as HTMLInputElement;
    if (el) {
      setInputAmount(units);
      el.value = units;
      el.focus();
    }
  };

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
                ~$?{" "}
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
                    onClick={() => setWalletOpen((prev) => !prev)}
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
                  value={convertFromWei(selectedSource.outputAmount)}
                  disabled
                />
                <ArrowPathIcon
                  className="ml-1 mb-1 inline h-5 w-5 text-gray-700"
                  aria-hidden="true"
                  role="button"
                // onClick={() => onInputChange(inputAmount)} // TODO: TRIGGER RELOAD OF ALL PROVIDERS ON CLICK
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
                ~$?{" "}
                <div className="inline-block h-4 w-4 align-middle">
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
