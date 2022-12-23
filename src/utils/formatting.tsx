import BigNumber from "bignumber.js";

export const BN = (value: string | number) => new BigNumber(value);
export const one = BN("1000000000000000000");

/**
 * Shift to units string from wei string without formatting
 */
export const convertFromWei = (units: string): string => {
  const weiString = BN(units).shiftedBy(-18).toFixed(18);
  return weiString;
};

/**
 * Shift units string to wei string
 */
export const convertToWei = (units: string): string => {
  const weiString = BN(units).shiftedBy(18).toFixed(0);
  return weiString;
};

/** Shift Wei string to units. Format using globalFormatting */
export const formatFromWei = (weiString: string, decs = 4): string => {
  let decimals = decs;
  let units = BN(weiString).shiftedBy(-18);
  const isNeg = units.isLessThan(0); // Check if we are dealing with a negative number
  units = units.absoluteValue(); // Make sure we only apply rounding logic to a non-negative number
  if (units.isLessThan(0.1) && decimals < 3) {
    decimals = 3;
  }
  if (units.isLessThan(0.01) && decimals < 4) {
    decimals = 4;
  }
  if (units.isLessThan(0.001) && decimals < 5) {
    decimals = 5;
  }
  if (units.isLessThan(0.0001) && decimals < 6) {
    decimals = 6;
  }
  if (units.isLessThanOrEqualTo(0)) {
    decimals = 2;
  }
  if (isNeg) {
    units = units.times(-1); // Re-apply the negative value (if applicable) before handing back
  }
  return units.toFormat(decimals);
};

/** Format using globalFormatting */
export const formatFromUnits = (
  unitString: string,
  formatDecimals = 0
): string => {
  let decimals = formatDecimals;
  let units = BN(unitString);
  const isNeg = units.isLessThan(0); // Check if we are dealing with a negative number
  units = units.absoluteValue(); // Make sure we only apply rounding logic to a non-negative number
  if (units.isLessThan(0.1) && decimals < 3) {
    decimals = 3;
  }
  if (units.isLessThan(0.01) && decimals < 4) {
    decimals = 4;
  }
  if (units.isLessThan(0.001) && decimals < 5) {
    decimals = 5;
  }
  if (units.isLessThan(0.0001) && decimals < 6) {
    decimals = 6;
  }
  if (units.isLessThanOrEqualTo(0)) {
    decimals = 2;
  }
  if (isNeg) {
    units = units.times(-1); // Re-apply the negative value (if applicable) before handing back
  }
  return units.toFormat(decimals);
};

/** Format to short number + letter (ie. 1,000,000 = 1M) */
export const formatShortNumber = (unitString: string): [string, string] => {
  let letterLabel = "";
  let shortNumb = BN(unitString);
  if (shortNumb.isLessThanOrEqualTo(1000)) {
    letterLabel = "K";
    shortNumb = shortNumb.div(1000);
  } else if (shortNumb.isLessThanOrEqualTo(1000000)) {
    letterLabel = "M";
    shortNumb = shortNumb.div(1000000);
  } else if (shortNumb.isLessThanOrEqualTo(1000000000)) {
    letterLabel = "B";
    shortNumb = shortNumb.div(1000000000);
  }
  return [shortNumb.toFormat(2), letterLabel];
};

export const shortenString = (string: string): string => {
  if (string.length > 9) {
    const first = string.slice(0, 4);
    const second = string.slice(string.length - 4);
    return first.concat("...").concat(second);
  }
  return string;
};

export const classNames = (...classes: string[]) => {
  return classes.join(" ");
};
