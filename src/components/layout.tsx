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
        {/* Give the main content a decent bottom-padding to account for weird action bars in mobile browsers */}
        <main className="mt-20 px-4 pb-20">{children}</main>
      </div>
    </>
  );
}
