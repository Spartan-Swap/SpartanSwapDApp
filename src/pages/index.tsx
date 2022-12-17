import type { NextPage } from "next";
import { useState } from "react";
import AssetSelect from "../components/assetSelect";
import PageHeading from "../components/pageHeading";

const button1 = { label: "GitHub?", link: "./" };
const button2 = { label: "Docs?", link: "./" };

const Swap: NextPage = () => {
  const [assetSelectOpen, setassetSelectOpen] = useState(false);
  const [assetId, setassetId] = useState(0);

  const toggleAssetSelectOpen = (assetId: number) => {
    setassetId(assetId);
    setassetSelectOpen(true);
  };

  return (
    <>
      <AssetSelect
        assetId={assetId}
        isOpen={assetSelectOpen}
        setOpen={setassetSelectOpen}
      />
      <PageHeading title="Swap" button1={button1} button2={button2} />
      <main className="container mx-auto flex flex-row flex-wrap space-x-1 p-4 sm:px-6 lg:px-8">
        <div id="first" className="">
          <div className="h-full overflow-hidden rounded-lg bg-white shadow">
            <div id="assetSection1" className="grid grid-cols-2 p-3">
              <div>Sell:</div>
              <div className="justify-self-end">Balance: #,###.## [MAX]</div>
              <div onClick={() => toggleAssetSelectOpen(1)}>LOGO Asset1</div>
              <div className="justify-self-end">
                <input
                  placeholder="Input Units Formbox"
                  className="text-right"
                />
              </div>
              <div>Copy Addr - 0x0...000</div>
              <div className="justify-self-end">Rate: ??</div>
            </div>
            <div id="assetSection2" className="grid grid-cols-2 p-3">
              <div>Buy:</div>
              <div className="justify-self-end">Balance: #,###.## [MAX]</div>
              <div onClick={() => toggleAssetSelectOpen(2)}>LOGO Asset1</div>
              <div className="justify-self-end">
                <input
                  placeholder="Input Units Formbox"
                  className="text-right"
                />
              </div>
              <div>Copy Addr - 0x0...000</div>
              <div className="justify-self-end">Rate: ??</div>
            </div>
            <div id="swapInfoSection" className="p-3">
              <span>Rate</span>
              <span className="float-right">Fees</span>
              <div>PCS Comparison Rate</div>
              <div>Simple Route Info</div>
            </div>
          </div>
        </div>
        <div id="second" className="">
          <div className="h-full overflow-hidden rounded-lg bg-white shadow">
            <div id="swapInfoSection" className="p-3">
              <span>Tab1</span>
              <span className="float-right">Tab2</span>
              <div>Price Chart Component (Tab1)</div>
              <div>Route Info Component (Tab2)</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Swap;
