import Image from "next/image";

export default function AssetSelectButton({
  handleToggleOpen,
  assetNumber,
  assetLogo,
  assetTicker,
}: {
  handleToggleOpen: (value: number) => void;
  assetNumber: number;
  assetLogo: string;
  assetTicker: string;
}) {
  return (
    <div
      onClick={() => handleToggleOpen(assetNumber)}
      role="button"
      className="w-max py-2"
    >
      <div>
        <div className="relative inline-block h-6 w-6 rounded-full">
          <Image alt="" src={assetLogo} fill className="object-contain" />
        </div>
        <div className="ml-2 inline-block h-6 align-top">{assetTicker}</div>
      </div>
    </div>
  );
}
