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
const walletOpenAtom = atom(false);
const txnOpenAtom = atom(false);
const assetSelectOpenAtom = atom(false);
const assetIdAtom = atom(1);
const selectedSourceAtom = atom("");
const isLoadingAtom = atom(false);
const inputAmountAtom = atom("0");
const outputAmountAtom = atom("0.00");
// Arrays - candidates for splitAtom(peopleAtom)
const allSourcesAtom = atom(swapSources);
const allSourcesAtomSplit = splitAtom(allSourcesAtom);
// Objects - candidates for focusAtom(dataAtom, (optic) => optic.prop('people'))
const selectedAsset1Atom = atomWithStorage("sswap-selectedAsset1", bnbAsset); // Persistent
const selectedAsset2Atom = atomWithStorage("sswap-selectedAsset2", spartaAsset); // Persistent

// ---- BUNDLE ATOMS PER VIEW / COMPONENT ----
export const allGlobalAtoms = {};
export const allTopbarAtoms = {};
export const allSidebarAtoms = {};
export const allSwapAtoms = {
  allSourcesAtom,
  allSourcesAtomSplit,
  walletOpenAtom,
  txnOpenAtom,
  assetSelectOpenAtom,
  assetIdAtom,
  selectedSourceAtom,
  isLoadingAtom,
  inputAmountAtom,
  outputAmountAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
};
// swapRatesTableItem.tsx
export const allSwapRatesTableItemAtoms = {
  allSourcesAtom,
  selectedSourceAtom,
  inputAmountAtom,
  selectedAsset1Atom,
  selectedAsset2Atom,
};
