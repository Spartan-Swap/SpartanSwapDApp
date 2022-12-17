import { createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
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

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc, optimism],
  [publicProvider()]
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
