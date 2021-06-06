import { InjectedConnector } from "@web3-react/injected-connector";
import { supportedChainIds } from "../chains";

export const injected = new InjectedConnector({
  // supportedChainIds: [1],
  supportedChainIds: supportedChainIds.slice(),

  // supportedChainIds: [1, 3, 4, 5, 42, 97],
});
