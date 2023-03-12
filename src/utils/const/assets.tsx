import type { Address } from "wagmi";

export type AssetProps = {
  name: string;
  ticker: string;
  address: Address;
  site: string;
  decimals: number;
  logo: string;
  peg: string;
  type: "Token" | "Native Coin";
  balance: string;
};

export const bnbAsset: AssetProps = {
  name: "BNB",
  ticker: "BNB",
  address: "0x0000000000000000000000000000000000000000",
  site: "https://www.binance.org/",
  decimals: 18,
  logo: "https://bscscan.com/token/images/binance_32.png",
  peg: "",
  type: "Native Coin",
  balance: "0"
};

export const spartaAsset: AssetProps = {
  name: "Spartan Protocol Token V2",
  ticker: "SPARTA",
  address: "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102",
  site: "https://spartanprotocol.org/",
  decimals: 18,
  logo: "https://bscscan.com/token/images/spartan2_32.png",
  peg: "",
  type: "Token",
  balance: "0"
};

export const assets: AssetProps[] = [
  bnbAsset,
  spartaAsset,
  {
    name: "Wrapped BNB",
    ticker: "WBNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    site: "https://www.binance.org/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/binance_32.png",
    peg: "BNB",
    type: "Token",
    balance: "0"
  },
  {
    name: "Trust Wallet Token",
    ticker: "TWT",
    address: "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
    site: "https://trustwallet.com/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/trust_32.png",
    peg: "",
    type: "Token",
    balance: "0"
  },
  {
    name: "Binance-Peg BUSD Token",
    ticker: "BUSD",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    site: "https://www.binance.com/en/busd",
    decimals: 18,
    logo: "https://bscscan.com/token/images/busd_32_2.png",
    peg: "USD",
    type: "Token",
    balance: "0"
  },
  {
    name: "Binance-Peg USD Coin",
    ticker: "USDC",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    site: "https://www.centre.io/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/centre-usdc_28.png",
    peg: "USD",
    type: "Token",
    balance: "0"
  },
  {
    name: "Binance-Peg BSC-USD",
    ticker: "USDT",
    address: "0x55d398326f99059fF775485246999027B3197955",
    site: "https://tether.to/en/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/busdt_32.png",
    peg: "USD",
    type: "Token",
    balance: "0"
  },
  {
    name: "Binance-Peg BTCB Token",
    ticker: "BTCB",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    site: "https://bitcoin.org/en/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/btcb_32.png",
    peg: "BTC",
    type: "Token",
    balance: "0"
  },
  {
    name: "Raven Protocol",
    ticker: "RAVEN",
    address: "0xcD7C5025753a49f1881B31C48caA7C517Bb46308",
    site: "https://www.ravenprotocol.com/",
    decimals: 18,
    logo: "https://bscscan.com/token/images/raven_32.png",
    peg: "",
    type: "Token",
    balance: "0"
  },
  // More assets...
];

export const recentAssetsPlaceholder = [assets[6], assets[4], assets[2], assets[0], assets[3]];