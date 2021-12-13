import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { Chains } from "../chains";

// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const supportedChainIds = [97, 56, 1, 42, 80001, 137, 3, 250, 43114];

export const injected = new InjectedConnector({
  supportedChainIds,
});

const rpcs = {
  1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  56: "https://bsc-dataseed.binance.org",
  137: "https://polygon-rpc.com",
  250: "https://rpc.ftm.tools",
  43114: "https://api.avax.network/ext/bc/C/rpc",
} as {
  [key in Chains]: string;
};

export const walletlink = new WalletLinkConnector({
  supportedChainIds,
  appName: "Cerby Token",
  url: "http://", // bypass links
  // url: rpcs[56],
  // @ts-ignore
});

export const walletconnect = Object.fromEntries(
  (supportedChainIds as Chains[]).map(item => [
    item,
    new WalletConnectConnector({
      supportedChainIds,
      // @ts-ignore
      infuraId: null,
      chainId: item,
      rpc: {
        [item]: rpcs[item],
      },
      qrcode: true,
    }),
  ]),
) as {
  [key in Chains]: WalletConnectConnector;
};
