import { InjectedConnector } from "@web3-react/injected-connector";

// export const supportedChainIds = [97, 42];
export const supportedChainIds = [1];

export const injected = new InjectedConnector({
  // supportedChainIds: [1],
  // supportedChainIds: [97, 42],
  supportedChainIds,

  // supportedChainIds: [1, 3, 4, 5, 42, 97],
});
