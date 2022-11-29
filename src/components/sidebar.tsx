import { FolderIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Swap", icon: HomeIcon, href: "#", current: true },
  { name: "Liquidity", icon: UsersIcon, href: "#", current: false },
  { name: "Vaults", icon: FolderIcon, href: "#", current: false },
];
const secondaryNavigation = [
  { name: "Item 1", href: "#" },
  { name: "Item 2", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.join(" ");
}

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen max-w-xs flex-1 flex-shrink flex-col bg-gray-800 pt-16">
      <div className="mt-5 flex flex-grow flex-col">
        <nav className="flex-1 space-y-8 px-2" aria-label="Sidebar">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                )}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-gray-300"
                      : "text-gray-400 group-hover:text-gray-300",
                    "mr-3 h-6 w-6 flex-shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </div>
          <div className="space-y-1">
            <h3
              className="px-3 text-sm font-medium text-gray-500"
              id="projects-headline"
            >
              Secondary Menu
            </h3>
            <div
              className="space-y-1"
              role="group"
              aria-labelledby="projects-headline"
            >
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
      <div className="flex flex-shrink-0 bg-gray-700 p-4">
        <a href="#" className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div className="text-white">*SOCIALS*</div>
          </div>
        </a>
      </div>
    </aside>
  );
}
