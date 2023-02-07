import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAccount } from "wagmi";
import { useAtom } from "jotai";

import { WalletDetails } from "./walletDetails";
import WalletSelect from "./walletSelect";

import { allWalletModalAtoms as atoms } from "../../state/globalStore";

export default function WalletModal() {
  const { isConnected } = useAccount();

  const [walletOpen, setWalletOpen] = useAtom(atoms.walletOpenAtom);

  return (
    <Transition.Root
      show={walletOpen}
      as={Fragment}
      // afterLeave={() => setQuery("")} // Handle clearing child props on leave (like search queries)
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setWalletOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
              {isConnected ? <WalletDetails /> : <WalletSelect />}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
