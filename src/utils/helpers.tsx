export const shortenString = (string: string) => {
  if (string.length > 9) {
    const first = string.slice(0, 4);
    const second = string.slice(string.length - 4);
    return first.concat("...").concat(second);
  }
  return string;
};
