// Use regular useState() for 100% localised state
// Use this Jotai atoms store for all state that:
// - does *not* need to be accessed within Redux with getState()
// - needs to be written or read from more than one place
// - basically just UI states like if a modal is open (especially if they have duplicated uses)
// Use Redux stores for all else
import { atom } from "jotai";

// State management using Jotai
// For persistence, use:
// import { atomWithStorage } from 'jotai/utils';
// ie. const darkModeAtom = atomWithStorage('darkMode', false);

// UI states (ie. modal#1 isOpen)
const walletOpenAtom = atom(false); // Wallet Modal isOpen
const sidebarOpenAtom = atom(true); // Sidebar isExpanded
const swapTxnOpenAtom = atom(false); // Swap txn modal isOpen
const assetSelectOpenAtom = atom(false);
// Selection states
const assetIdAtom = atom(1);

// ---- BUNDLED ATOM EXPORTS LAYOUT ----
export const allGlobalAtoms = {};
export const allLayoutAtoms = { walletOpenAtom };
export const allTopbarAtoms = { walletOpenAtom, sidebarOpenAtom };
export const allSidebarAtoms = {};

// ---- BUNDLED ATOM EXPORTS VIEWS ----
export const allSwapAtoms = {
  walletOpenAtom,
  swapTxnOpenAtom,
  assetSelectOpenAtom,
  assetIdAtom,
};

// ---- BUNDLED ATOM EXPORTS COMPONENTS ----
// walletModal.tsx
export const allWalletModalAtoms = {
  walletOpenAtom,
};
// txnModal.tsx
export const allSwapTxnModalAtoms = {
  swapTxnOpenAtom,
};
// swapSidePanel.tsx
export const allSwapSidePanelAtoms = {
  swapTxnOpenAtom,
};
// assetSelect.tsx
export const allAssetSelectAtoms = {
  assetSelectOpenAtom,
  assetIdAtom,
};
