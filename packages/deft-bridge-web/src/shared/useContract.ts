import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  CrossChainBridge__factory,
  MintableBurnableToken__factory,
} from "../types/ethers-contracts";
export function getSigner(
  library: Web3Provider,
  account: string,
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string | null,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

const BRIDGE_CONTRACT = "0xf65c3c4cB733b3641bCb14d248EF1A34Ed5A2016";
// const TOKEN_CONTRACT = "0xdef1fac7Bf08f173D286BbBDcBeeADe695129840";

export function useBridgeContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = CrossChainBridge__factory.connect(
    BRIDGE_CONTRACT,
    providerOrSigner,
  );

  return res;
}

export function useTokenContract(token: string) {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = MintableBurnableToken__factory.connect(token, providerOrSigner);

  // res.on("error", err =>
  //   console.log({
  //     err,
  //   }),
  // );

  return res;
}
