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

const BRIDGE_CONTRACT = "0xBBECB9CCb15Cb55A20933861D04a1BC0Fe37c559";
const TOKEN_CONTRACT = "0x45bb6DF6bc5202bf3B108270326EAE40B1cc570F";

export function useBridgeContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = CrossChainBridge__factory.connect(
    BRIDGE_CONTRACT,
    providerOrSigner,
  );

  return res;
}

export function useTokenContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = MintableBurnableToken__factory.connect(
    TOKEN_CONTRACT,
    providerOrSigner,
  );

  return res;
}
