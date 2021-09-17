import { InjectedConnector } from "@web3-react/injected-connector";

export const supportedChainIds = [97, 56, 1, 42, 80001, 137, 3];

export const injected = new InjectedConnector({
  supportedChainIds,
});
