import { atom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";

import { bnbAsset, spartaAsset } from "../components/assetSelect";
import { swapSources } from "../utils/swapSources";

// State management using Jotai
// For persistence, use:
// import { atomWithStorage } from 'jotai/utils';
// const darkModeAtom = atomWithStorage('darkMode', false);

// ---- SWAP PAGE STATES ----
// Simple types
const walletOpenAtom = atom(false); // Wallet Modal isOpen
const sidebarOpenAtom = atom(true); // Sidebar isExpanded
const swapTxnOpenAtom = atom(false); // Swap txn modal isOpen
const assetSelectOpenAtom = atom(false);
const assetIdAtom = atom(1);
const selectedSourceAtom = atom("");
const inputAmountAtom = atom("0");
const outputAmountAtom = atom("0.00");
// Arrays - candidates for splitAtom(peopleAtom)
const allSourcesAtom = atom(swapSources);
const allSourcesAtomSplit = splitAtom(allSourcesAtom);
// Objects - candidates for focusAtom(dataAtom, (optic) => optic.prop('people'))
const selectedAsset1Atom = atomWithStorage("sswap-selectedAsset1", bnbAsset); // Persistent
const selectedAsset2Atom = atomWithStorage("sswap-selectedAsset2", spartaAsset); // Persistent

// ---- BUNDLED ATOM EXPORTS LAYOUT ----
export const allGlobalAtoms = {};
export const allLayoutAtoms = { walletOpenAtom };
export const allTopbarAtoms = { walletOpenAtom, sidebarOpenAtom };
export const allSidebarAtoms = {};

// ---- BUNDLED ATOM EXPORTS VIEWS ----
export const allSwapAtoms = {
  allSourcesAtom,
  walletOpenAtom,
  swapTxnOpenAtom,
  assetSelectOpenAtom,
  assetIdAtom,
  selectedSourceAtom,
  inputAmountAtom,
  outputAmountAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
};

// ---- BUNDLED ATOM EXPORTS COMPONENTS ----
// walletModal.tsx
export const allWalletModalAtoms = {
  walletOpenAtom,
};
// swapRatesTable.tsx
export const allSwapRatesTableAtoms = {
  allSourcesAtomSplit,
};
// swapRatesTableItem.tsx
export const allSwapRatesTableItemAtoms = {
  selectedSourceAtom,
  inputAmountAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
};
// txnModal.tsx
export const allSwapTxnModalAtoms = {
  swapTxnOpenAtom,
};
// swapSidePanel.tsx
export const allSwapSidePanelAtoms = {
  selectedSourceAtom,
  inputAmountAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
  swapTxnOpenAtom,
};
// assetSelect.tsx
export const allAssetSelectAtoms = {
  assetSelectOpenAtom,
  assetIdAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
};
