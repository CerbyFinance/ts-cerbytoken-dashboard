import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { PresaleFactory__factory } from "../types/ethers-contracts";

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

export function usePresaleContract(contractAddress: string) {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = PresaleFactory__factory.connect(
    contractAddress,
    providerOrSigner,
  );

  return res;
}
