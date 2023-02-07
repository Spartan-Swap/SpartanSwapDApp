import { useAtom } from "jotai";

import Topbar from "./topbar";
import Sidebar from "./sidebar";
import WalletModal from "../wallet/walletModal";

import { allLayoutAtoms as atoms } from "../../state/globalStore";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [walletOpen, ] = useAtom(atoms.walletOpenAtom);

  return (
    <>
      <Topbar />
      <div className="flex flex-row bg-gray-200">
        <Sidebar />
        {walletOpen && (
          <WalletModal />
        )}
        <div className="my-16 w-full">{children}</div>
      </div>
    </>
  );
}
