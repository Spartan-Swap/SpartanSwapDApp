import { BN, formatFromWei } from "./formatting";

export const returnUsdValAsset = (weiUnits: string, usdPerUnit: string, decs?: number) => {
  return BN(weiUnits).isGreaterThan("0") && BN(usdPerUnit).isGreaterThan("0")
    ? formatFromWei(BN(weiUnits).times(usdPerUnit).toString(), decs)
    : "?";
};
