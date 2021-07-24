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

const BRIDGE_CONTRACT = "0x1d2900622B5049D9479DC8BE06469A4ede3Fc96e";
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

  return res;
}
