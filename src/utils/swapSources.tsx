import { address0, gasDefault, ssUtilsAddress } from "./const";
import ssUtilsAbi from "../utils/ABIs/56/SPV2/SpartanSwapUtils.json";

import type { Provider } from "@wagmi/core";
import { Contract } from "ethers";
import type { AssetProps } from "../components/assetSelect";

export const CoinGeckoLogoTemp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 276 276"
    height="100%"
    width="100%"
  >
    <title>CoinGecko</title>
    <g id="Coin_Gecko_AI" data-name="Coin Gecko AI">
      <path
        d="M276,137.39A138,138,0,1,1,137.39,0h0A138,138,0,0,1,276,137.39Z"
        transform="translate(0 0)"
        fill="#8dc63f"
      />
      <path
        d="M265.65,137.44a127.63,127.63,0,1,1-128.21-127h0A127.65,127.65,0,0,1,265.65,137.44Z"
        transform="translate(0 0)"
        fill="#f9e988"
      />
      <path
        fill="#fff"
        d="M140.35,18.66a70.18,70.18,0,0,1,24.53,0,74.75,74.75,0,0,1,23.43,7.85c7.28,4,13.57,9.43,19.83,14.52s12.49,10.3,18.42,16a93.32,93.32,0,0,1,15.71,19,108.28,108.28,0,0,1,11,22.17c5.33,15.66,7.18,32.53,4.52,48.62H257c-2.67-15.95-6.29-31.15-12-45.61A177.51,177.51,0,0,0,235.56,80,209.1,209.1,0,0,0,223.14,60a72.31,72.31,0,0,0-16.64-16.8c-6.48-4.62-13.93-7.61-21.14-10.45S171,27,163.48,24.84s-15.16-3.78-23.14-5.35Z"
        transform="translate(0 0)"
      />
      <path
        fill="#8bc53f"
        d="M202.74,92.39c-9.26-2.68-18.86-6.48-28.58-10.32-.56-2.44-2.72-5.48-7.09-9.19-6.35-5.51-18.28-5.37-28.59-2.93-11.38-2.68-22.62-3.63-33.41-1C16.82,93.26,66.86,152.57,34.46,212.19c4.61,9.78,54.3,66.84,126.2,51.53,0,0-24.59-59.09,30.9-87.45C236.57,153.18,269.09,110.46,202.74,92.39Z"
        transform="translate(0 0)"
      />
      <path
        fill="#fff"
        d="M213.64,131.2a5.35,5.35,0,1,1-5.38-5.32A5.36,5.36,0,0,1,213.64,131.2Z"
        transform="translate(0 0)"
      />
      <path
        fill="#009345"
        d="M138.48,69.91c6.43.46,29.68,8,35.68,12.12-5-14.5-21.83-16.43-35.68-12.12Z"
        transform="translate(0 0)"
      />
      <path
        fill="#fff"
        d="M144.6,106.58a24.68,24.68,0,1,1-24.69-24.67h0a24.68,24.68,0,0,1,24.68,24.66Z"
        transform="translate(0 0)"
      />
      <path
        fill="#58595b"
        d="M137.28,106.8a17.36,17.36,0,1,1-17.36-17.36h0A17.36,17.36,0,0,1,137.28,106.8Z"
        transform="translate(0 0)"
      />
      <path
        fill="#8bc53f"
        d="M233.63,142.08c-20,14.09-42.74,24.78-75,24.78-15.1,0-18.16-16-28.14-8.18-5.15,4.06-23.31,13.14-37.72,12.45S55,162,48.49,131.23C45.91,162,44.59,184.65,33,210.62c23,36.83,77.84,65.24,127.62,53C155.31,226.27,188,189.69,206.34,171c7-7.09,20.3-18.66,27.29-28.91Z"
        transform="translate(0 0)"
      />
      <path
        fill="#58595b"
        d="M232.85,143c-6.21,5.66-13.6,9.85-21.12,13.55a134.9,134.9,0,0,1-23.7,8.63c-8.16,2.11-16.67,3.7-25.29,2.92s-17.43-3.71-23.14-10.17l.27-.31c7,4.54,15.08,6.14,23.12,6.37a108.27,108.27,0,0,0,24.3-2,132.71,132.71,0,0,0,23.61-7.3c7.63-3.15,15.18-6.8,21.68-12Z"
        transform="translate(0 0)"
      />
    </g>
  </svg>
);

export type SwapSourceProps = {
  id: string;
  name: string;
  type: "Swap Aggregator" | "Automated Market Maker";
  imagesq: string;
  imagelg: string;
  integrated: boolean;
  outputAmount: string;
  gasEstimate: string;
  loading: boolean;
  error: string;
  extCall: (
    asset1: AssetProps,
    asset2: AssetProps,
    weiInput: string,
    provider?: Provider
  ) => Promise<[string, string, string]>;
  extCallFinal: (
    asset1: AssetProps,
    asset2: AssetProps,
    weiInput: string,
    provider?: Provider,
    userWalletAddr?: string
  ) => Promise<[string, string, string]>;
};

// const spartanProtocolV1SourceExtCall = async (
//   selectedAsset1Addr: string,
//   selectedAsset2Addr: string,
//   weiInput: string,
//   provider: Provider | undefined
// ) => {
//   let returnVal: [string, string] = ["", ""];
//   if (provider) {
//     const quoteSPV2Contract = new Contract(
//       ssUtilsAddress,
//       ssUtilsAbi.abi,
//       provider
//     );
//     if (quoteSPV2Contract) {
//       await quoteSPV2Contract.callStatic
//         ?.getSwapOutput?.(selectedAsset1Addr, selectedAsset2Addr, weiInput)
//         .then((result) => {
//           if (result) {
//             returnVal = [result.toString(), ""];
//           } else {
//             returnVal = ["0", "Error"];
//           }
//         });
//     }
//   }
//   return returnVal;
// };

// export const spartanProtocolV1Source: SwapSourceProps = {
//   id: "SPV1",
//   name: "Spartan Protocol V1",
//   type: "Automated Market Maker",
//   imagesq:
//     "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/spartav2.svg",
//   imagelg:
//     "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/sparta-text-short.svg",
//   outputAmount: "0",
//   loading: false,
//   error: "",
//   extCall: (asset1Addr, asset2Addr, weiInput, providerObj) =>
//     spartanProtocolV1SourceExtCall(
//       asset1Addr,
//       asset2Addr,
//       weiInput,
//       providerObj
//     ),
// };

const spartaV2TokenAddr = "0x3910db0600eA925F63C36DdB1351aB6E2c6eb102";

const spartanProtocolV2SourceExtCall = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  provider: Provider | undefined,
  userWalletAddr?: string
) => {
  const gasEst = [selectedAsset1.address.toLowerCase(), selectedAsset2.address.toLowerCase()].includes(spartaV2TokenAddr.toLowerCase())
    ? "230000" // Single-swap gas estimate
    : "320000" // Double-swap gas estimate
  let returnVal: [string, string, string] = ["", "", ""];
  if (provider) {
    const quoteSPV2Contract = new Contract(
      ssUtilsAddress,
      ssUtilsAbi.abi,
      provider
    );
    if (quoteSPV2Contract) {
      await quoteSPV2Contract.callStatic
        ?.getSwapOutput?.(
          selectedAsset1.address,
          selectedAsset2.address,
          weiInput
        )
        .then((result) => {
          if (result) {
            returnVal = [result.toString(), gasEst, ""];
          } else {
            returnVal = ["0", "", "Error"];
          }
        });
    }
  }
  return returnVal;
};

export const spartanProtocolV2Source: SwapSourceProps = {
  id: "SPV2",
  name: "Spartan Protocol V2",
  type: "Automated Market Maker",
  imagesq:
    "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/spartav2.svg",
  imagelg:
    "https://raw.githubusercontent.com/spartan-protocol/resources/7badad6b092e8c07ab4c97d04802ad2d9009a379/logos/rendered/svg/sparta-text-short.svg",
  integrated: false,
  outputAmount: "0",
  gasEstimate: "",
  loading: false,
  error: "",
  extCall: (asset1, asset2, weiInput, providerObj) =>
    spartanProtocolV2SourceExtCall(asset1, asset2, weiInput, providerObj),
  extCallFinal: (asset1, asset2, weiInput, providerObj, userWalletAddr) =>
    spartanProtocolV2SourceExtCall(asset1, asset2, weiInput, providerObj, userWalletAddr),
  // TODO: Update SSwap API quote endpoint to include calldata via SP router
};

const oneInchSourceExtCall = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  const _asset1Addr = selectedAsset1.address.toLowerCase() === address0 ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : selectedAsset1.address
  const _asset2Addr = selectedAsset2.address.toLowerCase() === address0 ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : selectedAsset2.address
  let returnVal: [string, string, string] = ["", "", ""];
  const queryUrl =
    "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
    _asset1Addr +
    "&toTokenAddress=" +
    _asset2Addr +
    "&amount=" +
    weiInput +
    "&gasPrice=" +
    gasDefault;
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal = ["0", "", data.error];
      } else {
        returnVal = [data.toTokenAmount, data.estimatedGas.toString(), ""];
      }
    });
  return returnVal;
};

const oneInchSourceExtCallFinal = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  userWalletAddr?: string,
) => {
  const _asset1Addr = selectedAsset1.address.toLowerCase() === address0 ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : selectedAsset1.address
  const _asset2Addr = selectedAsset2.address.toLowerCase() === address0 ? "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" : selectedAsset2.address
  let returnVal: [string, string, string] = ["", "", ""];
  const queryUrl =
    "https://api.1inch.io/v5.0/56/swap?&fromTokenAddress=" +
      _asset1Addr +
      "&toTokenAddress=" +
      _asset2Addr +
      "&amount=" +
      weiInput +
      "&gasPrice=" +
      gasDefault +
      userWalletAddr ? "&fromAddress=" +
    userWalletAddr : "";
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        returnVal = ["0", "", data.error];
      } else {
        returnVal = [data.toTokenAmount, data.estimatedGas.toString(), ""];
      }
    });
  return returnVal;
};

export const oneInchSource: SwapSourceProps = {
  id: "1INCH",
  name: "1-inch Network",
  type: "Swap Aggregator",
  imagesq: "https://cryptologos.cc/logos/1inch-1inch-logo.svg",
  imagelg: "https://1inch.io/img/pressRoom/logo.svg",
  integrated: false,
  outputAmount: "0",
  gasEstimate: "",
  loading: false,
  error: "",
  extCall: (asset1Addr, asset2Addr, weiInput) =>
    oneInchSourceExtCall(asset1Addr, asset2Addr, weiInput),
  extCallFinal: (asset1, asset2, weiInput, providerObj, userWalletAddr) =>
    oneInchSourceExtCallFinal(asset1, asset2, weiInput, userWalletAddr),
};

const zeroXExtCall = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string,
  userWalletAddr?: string
) => {
  // TODO: Handle gas asset (coin) string based on network selected
  // ie. if ethereum mainnet and address === address(0) use "ETH" instead of "BNB"
  const _asset1Addr = selectedAsset1.address.toLowerCase() === address0 ? "BNB" : selectedAsset1.address
  const _asset2Addr = selectedAsset2.address.toLowerCase() === address0 ? "BNB" : selectedAsset2.address
  let returnVal: [string, string, string] = ["", "", ""];
  const queryUrl =
    "https://bsc.api.0x.org/swap/v1/quote?sellToken=" +
      _asset1Addr +
      "&buyToken=" +
      _asset2Addr +
      "&sellAmount=" +
      weiInput +
      "&gasPrice=" +
      gasDefault +
      "&affiliateAddress=0x683550a863772d435da110679131758b6a69aecb" + // Just for DAU tracking, not actual affiliate fees
      userWalletAddr ? "&takerAddress=" + userWalletAddr : "";
  await fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.reason) {
        returnVal = ["0", "", data.reason];
      } else {
        returnVal = [data.buyAmount, data.estimatedGas, ""];
      }
    });
  return returnVal;
};

export const zeroXSource: SwapSourceProps = {
  id: "0X",
  name: "0x",
  type: "Swap Aggregator",
  imagesq: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  imagelg: "https://cryptologos.cc/logos/0x-zrx-logo.svg",
  integrated: false,
  outputAmount: "0",
  gasEstimate: "",
  loading: false,
  error: "",
  extCall: (asset1Addr, asset2Addr, weiInput) =>
    zeroXExtCall(asset1Addr, asset2Addr, weiInput),
  extCallFinal: (asset1Addr, asset2Addr, weiInput, providerObj, userWalletAddr) =>
    zeroXExtCall(asset1Addr, asset2Addr, weiInput, userWalletAddr),
};

const pancakeswapExtCall = async (
  selectedAsset1: AssetProps,
  selectedAsset2: AssetProps,
  weiInput: string
) => {
  const result: [string, string, string] = ["", "", ""];
  // const queryUrl =
  //   "https://api.1inch.io/v5.0/56/quote?&fromTokenAddress=" +
  //   selectedAsset1Addr +
  //   "&toTokenAddress=" +
  //   selectedAsset2Addr +
  //   "&amount=" +
  //   weiInput +
  //   "&gasPrice=" +
  //   gasDefault;
  // fetch(queryUrl)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.error) {
  //       result = ["0", data.error];
  //     } else {
  //       result = [data.toTokenAmount, ""];
  //     }
  //   });
  return result;
};

export const pancakeswapSource: SwapSourceProps = {
  id: "PCS",
  name: "PancakeSwap",
  type: "Automated Market Maker",
  imagesq: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
  imagelg: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
  integrated: false,
  outputAmount: "0",
  gasEstimate: "",
  loading: false,
  error: "",
  extCall: (asset1Addr, asset2Addr, weiInput) =>
    pancakeswapExtCall(asset1Addr, asset2Addr, weiInput),
  extCallFinal: (asset1Addr, asset2Addr, weiInput) =>
    pancakeswapExtCall(asset1Addr, asset2Addr, weiInput),
};

export const swapSources: SwapSourceProps[] = [
  spartanProtocolV2Source,
  oneInchSource,
  zeroXSource,
  pancakeswapSource,
];

export type Provider1InchProps = {
  fromToken: {
    symbol: string; // "WBNB",
    name: string; // "Wrapped BNB";
    decimals: number; // 18;
    address: string; // "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    logoURI: string; // "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png";
    tags: string[]; // ["tokens", "PEG:BNB"];
  };
  toToken: {
    symbol: string; // "SPARTA";
    name: string; // "Spartan Protocol Token";
    decimals: number; // 18;
    address: string; // "0x3910db0600ea925f63c36ddb1351ab6e2c6eb102";
    logoURI: string; // "https://tokens.1inch.io/0x3910db0600ea925f63c36ddb1351ab6e2c6eb102.png";
    tags: string[]; // ["tokens"];
  };
  toTokenAmount: string; // "20645979163629502219486";
  fromTokenAmount: string; // "1000000000000000000";
  protocols: [
    {
      name: string; // "BSC_PMM3";
      part: number; // 100
      fromTokenAddress: string; // "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
      toTokenAddress: string; // "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
    }
  ];
  estimatedGas: number; // 893808;
};
