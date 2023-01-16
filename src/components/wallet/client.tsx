import { createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { mainnet, bsc, optimism } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { LedgerConnector } from "wagmi/connectors/ledger";

import type { Connector } from "wagmi";

export type WalletProps = {
  id: string;
  name: string;
  url: string;
  logo: string;
  tags: string[];
  desc: string;
  hwWallet: string;
  connector: Connector;
};

export const ethRpcsMN = [
  // TODO: Order these by whether they are private (priority1) and fast (priority2)
  // Main RPCs
  "https://eth.llamarpc.com",
  "https://rpc.builder0x69.io",
  "https://eth-rpc.gateway.pokt.network",
  "https://singapore.rpc.blxrbdn.com",
  "https://rpc.flashbots.net",
  "https://1rpc.io/eth",
  "https://ethereum.publicnode.com",
  // BACKUPS BELOW
  // "",
  // ENV conditionals - Make sure conditional RPCs are not the first index of this array
  // process.env.NODE_ENV === 'production'
  //   ? 'https://bsc-mainnet.nodereal.io/v1/cf893e692ffa45098367d6c47fb3ff11' // Permissioned to the SP domain (whitelist)
  //   : process.env.REACT_APP_NODEREAL_PRIVATE,
];

export const bscRpcsMN = [
  // TODO: Order these by whether they are private (priority1) and fast (priority2)
  // Main RPCs
  "https://bsc-dataseed.binance.org/",
  "https://bsc-dataseed1.defibit.io/",
  "https://bsc-dataseed1.ninicoin.io/",
  // BACKUPS BELOW
  "https://bsc-dataseed2.defibit.io/",
  "https://bsc-dataseed3.defibit.io/",
  "https://bsc-dataseed4.defibit.io/",
  "https://bsc-dataseed2.ninicoin.io/",
  "https://bsc-dataseed3.ninicoin.io/",
  "https://bsc-dataseed4.ninicoin.io/",
  "https://bsc-dataseed1.binance.org/",
  "https://bsc-dataseed2.binance.org/",
  "https://bsc-dataseed3.binance.org/",
  "https://bsc-dataseed4.binance.org/",
  "https://rpc.ankr.com/bsc",
  "https://bscrpc.com",
  "https://binance.nodereal.io",
  // ENV conditionals - Make sure conditional RPCs are not the first index of this array
  // process.env.NODE_ENV === 'production'
  //   ? 'https://bsc-mainnet.nodereal.io/v1/cf893e692ffa45098367d6c47fb3ff11' // Permissioned to the SP domain (whitelist)
  //   : process.env.REACT_APP_NODEREAL_PRIVATE,
];

export const optimismRpcsMN = [
  // TODO: Order these by whether they are private (priority1) and fast (priority2)
  // Main RPCs
  "https://mainnet.optimism.io",
  "https://1rpc.io/op",
  "https://optimism-mainnet.public.blastapi.io",
  "https://rpc.ankr.com/optimism",
  "https://endpoints.omniatech.io/v1/op/mainnet/public",
  // BACKUPS BELOW
  // "",
  // ENV conditionals - Make sure conditional RPCs are not the first index of this array
  // process.env.NODE_ENV === 'production'
  //   ? 'https://bsc-mainnet.nodereal.io/v1/cf893e692ffa45098367d6c47fb3ff11' // Permissioned to the SP domain (whitelist)
  //   : process.env.REACT_APP_NODEREAL_PRIVATE,
];

const getRPCs = (chainId: number) => {
  if (chainId === mainnet.id) {
    return ethRpcsMN;
  }
  if (chainId === bsc.id) {
    return bscRpcsMN;
  }
  if (chainId === optimism.id) {
    return optimismRpcsMN;
  }
  return [];
};

const getProviders = () => {
  const rpcList = [publicProvider({ priority: 11 })];
  for (let i = 0; i < 10; i++) {
    rpcList.push(
      jsonRpcProvider({
        priority: i,
        rpc: (chain) => {
          const _rpcs = getRPCs(chain.id);
          const _rpc = _rpcs[i];
          if (_rpc) {
            return {
              http: _rpc,
              // webSocket: `wss://${chain.id}.example.com`,
            };
          }
          i = 10;
          return null;
        },
      })
    );
  }
  return rpcList;
};

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc, optimism],
  getProviders(),
  // [
  //   jsonRpcProvider({
  //     priority: 0,
  //     rpc: (chain) => ({
  //       http: `https://${chain.id}.example.com`,
  //       webSocket: `wss://${chain.id}.example.com`,
  //     }),
  //   }),
  //   alchemyProvider({ priority: 1 }),
  // ],
  { stallTimeout: 500 }
);

export const walletList: WalletProps[] = [
  {
    id: "metaMask",
    name: "MetaMask",
    url: "https://metamask.io/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "Offering a browser extension for desktop users and also mobile apps for iOS & android",
    hwWallet:
      "Supports Ledger & Trezor hardware wallets via the browser extension (desktop). Currently only supports QR-based hardware wallets (like Keystone) via mobile app, Ledger Nano X support is coming for mobile soon though",
    connector: new MetaMaskConnector({ chains }),
  },
  {
    id: "trustWallet",
    name: "TrustWallet",
    url: "https://trustwallet.com/",
    logo: "https://trustwallet.com/assets/images/media/assets/TWT.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "Offering a browser extension for desktop users and also mobile apps for iOS & android",
    hwWallet: "No hardware wallet support",
    connector: new InjectedConnector({ chains }), // TODO: Make TrustWallet connector with conditional checks and whatnot
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    url: "https://walletconnect.com/",
    logo: "https://trustwallet.com/assets/images/media/assets/TWT.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "A protocol to connect to 170+ wallets using a QR code",
    hwWallet: "No hardware wallet support",
    connector: new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  },
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    url: "https://www.coinbase.com/wallet",
    logo: "https://www.svgrepo.com/show/331345/coinbase-v2.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "Offering a browser extension for desktop users and also mobile apps for iOS & android",
    hwWallet: "No hardware wallet support",
    connector: new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
  },
  {
    id: "injected",
    name: "Other 'Injected' Wallets",
    url: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "Try this option to connect most other EVM wallets",
    hwWallet: "No hardware wallet support",
    connector: new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  },
  {
    id: "ledger",
    name: "LedgerLive",
    url: "https://www.ledger.com/ledger-live",
    logo: "https://logotyp.us/files/ledger.svg",
    tags: ["desktop", "iOS", "android"],
    desc: "Use your Ledger hardware wallet via LedgerLive on this device or your mobile",
    hwWallet:
      "Ledger devices are supported as long as you have it connected to LedgerLive on this device or on your mobile",
    connector: new LedgerConnector({
      chains,
    }),
  },
];

// Set up client
export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
