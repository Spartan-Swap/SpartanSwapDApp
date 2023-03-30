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
//   outputWei: "0",
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