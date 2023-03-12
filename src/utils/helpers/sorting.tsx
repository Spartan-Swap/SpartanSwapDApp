import { BN } from "../helpers/formatting";

export const sortDescBN = (amountA: string, amountB: string) => {
  return BN(amountA).isGreaterThan(amountB)
    ? -1
    : BN(amountA).isLessThan(amountB)
    ? 1
    : 0;
};