import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { DefiFactoryTokenContract__factory } from "../types/ethers-contracts";

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

const DEFT = "0x1f1f530b0E57CeB7a24c5782eB8c105326241752";

export function useDeftContract() {
  const { account, library, connector } = useWeb3React();

  const providerOrSigner = getProviderOrSigner(library, account);

  const res = DefiFactoryTokenContract__factory.connect(DEFT, providerOrSigner);

  return res;
}
