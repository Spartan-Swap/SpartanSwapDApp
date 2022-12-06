import Topbar from "./topbar";
import Sidebar from "./sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Topbar />
      <div className="flex flex-row bg-gray-200">
        <Sidebar />
        <div className="my-16 w-full">{children}</div>
      </div>
    </>
  );
}
